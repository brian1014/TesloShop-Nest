import { Injectable, Logger, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')
  
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}
  
  async createUser(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      delete user.password
    
      return { 
        ...user,
        token: this.getJwtToken({email: user.email})
      }
    } catch (error) {
      this.logger.error(error)
      this.handleDBErrors(error)
    }
  }

  async login({ email, password}: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    })

    if (!user) 
      throw new UnauthorizedException('Credentials are not valid')

    if(!bcrypt.compareSync(password, user.password)) 
      throw new UnauthorizedException('Credentials are not valid')

    return { 
      ...user,
      token: this.getJwtToken({email: user.email})
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(`${error.detail}`)

    this.logger.error(error)
    throw new InternalServerErrorException('Check server logs')
  }
}
