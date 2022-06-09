import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/me/confirm-email/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        url: url,
      },
    });
  }

  //Newsletter
  async sendNewsletter(
    users: User[],
    subject: string,
    text: string,
    url: string,
  ) {
    await this.mailerService.sendMail({
      to: users.map((user) => user.email),
      subject: subject,
      template: 'mailcompaign',
      context: {
        text: text,
        url: url,
      },
    });
  }
}
