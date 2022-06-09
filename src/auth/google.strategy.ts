import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { User } from './schema/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, name } = profile;
    let userEmail = await this.authService.findUserByEmail(emails[0].value);
    let user: User;

    if (!userEmail) {
      user = await this.authService.createUserWithGoogle(
        name.givenName,
        name.familyName,
        emails[0].value,
        id,
      );
      done(null, { user, accessToken });
    } else {
      done(null, { user, accessToken });
    }
  }
}
