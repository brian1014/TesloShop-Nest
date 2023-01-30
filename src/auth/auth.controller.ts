import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service'
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto)
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User
    // @Req() request: Express.Request
  ) {
    // console.log({ user: request.user })
    return {
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }
}
