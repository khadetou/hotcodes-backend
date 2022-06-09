import { MailModule } from 'src/mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { User, UserSchema } from './schema/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MailModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    /* { provide: APP_GUARD, useClass: RolesGuard }, 
    Normally should be used but it's checks the role before the user is authenticated therefore it's not needed instead use @UseGuards(AuthGuard('jwt'), RolesGuard) in our controller*/
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
