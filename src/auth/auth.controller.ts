import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthUpdateCredentialsDto } from './dto/update-user-credentials.dto';
import { GetUser } from './get-user-decorator';
import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { RolesGuard } from './roles/roles.guard';
import { User } from './schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //UPDATE USER
  @Put('/update/profile')
  async upadateUser(
    @Body() authUpdateCredentialsDto: AuthUpdateCredentialsDto,
  ): Promise<User> {
    return await this.authService.updateUser(authUpdateCredentialsDto);
  }

  //GET ALL USERS
  @Get('users')
  // @Auth(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(): Promise<User[]> {
    return await this.authService.getAllUsers();
  }

  //GET USER BY ID
  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.authService.getUserById(id);
  }

  //DELETE USER
  @Delete('user/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.authService.deleteUser(id);
  }

  @Get('/user')
  @UseGuards(AuthGuard(['jwt']))
  async getUser(@GetUser() user: User): Promise<User> {
    return user;
  }

  //GOOGLE SIGNIN
  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleCallback(@GetUser() user: User) {
  //   return user;
  // }

  @Post('/google/signin')
  async signinWithGoogle(
    @Body('token') token: string,
  ): Promise<{ user: User; accessToken: string }> {
    return await this.authService.signInWithGoogle(token);
  }

  //NORMAL SIGNIN
  @Post('/signup')
  async signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.authService.createUser(authCredentialsDto);
  }

  @Post('/signin')
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string; user: User }> {
    return await this.authService.signIn(email, password);
  }

  //FORGOT PASSWORD
  @Post('/forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(email);
  }

  @Put('/confirm-email/:token')
  async resetPassword(
    @Body('password') password: string,
    @Param('token') token: string,
  ): Promise<User> {
    return await this.authService.resetPassword(token, password);
  }

  //SEND NEWSLETTER
  @Post('/send-newsletter')
  @Auth(Role.Admin)
  async sendNewsletter(
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('url') url: string,
  ): Promise<void | { message: string }> {
    return await this.authService.sendMails(subject, text, url);
  }
}
