import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../entities/user.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }


  async validate({ email }: JwtPayload): Promise<User> {
    
    const user = await this.userRepository.findOneBy({ email })

    if (!user) 
      throw new UnauthorizedException(`Token not valid`)

    if (!user.isActive) 
      throw new UnauthorizedException(`User is not active, talk with Admin`)
    
    return user // Se añade a la request
  }
}