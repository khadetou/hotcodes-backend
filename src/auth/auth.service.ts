import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthUpdateCredentialsDto } from './dto/update-user-credentials.dto';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  //GET ALL USERS
  async getAllUsers(): Promise<User[]> {
    //get all users except where user is admin
    return await this.userModel.find({ roles: { $ne: 'admin' } }).exec();
  }

  //GET USER BY ID
  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  //DELTE USER
  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  //FIND USER BY EMAIL
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  //FIND USER BY GOOGLE ID
  async findUserByGoogleId(googleId: string): Promise<User> {
    return await this.userModel.findOne({ googleId }).exec();
  }

  //CREATE USER WITH GOOGLE AUTH
  async createUserWithGoogle(
    firstName: string,
    lastName: string,
    email: string,
    googleId: string,
  ): Promise<User> {
    const user = new this.userModel({
      firstName,
      lastName,
      email,
      googleId,
    });
    try {
      return await user.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new Error('User already exists');
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }

  //LOGIN USER WITH GOOGLE AUTH
  async signInWithGoogle(
    token: any,
  ): Promise<{ user: any; accessToken: string }> {
    const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });
    const payloads = ticket.getPayload();

    const user = await this.findUserByEmail(payloads.email);
    if (user) {
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken, user };
    } else {
      const user = await this.createUserWithGoogle(
        payloads.name.split(' ')[0],
        payloads.name.split(' ')[1],
        payloads.email,
        payloads.sub,
      );
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken, user };
    }
  }

  //CREATE USER WITH EMAIL AND PASSWORD
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { firstName, lastName, email, phone, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    let user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      user = new this.userModel({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      });
      try {
        return await user.save();
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    } else {
      throw new ConflictException('User already exists');
    }
  }

  //UPDATE USER CREDENTIALS
  async updateUser(authUpdateCredentialsDto: AuthUpdateCredentialsDto) {
    const { firstName, lastName, email, phone, password } =
      authUpdateCredentialsDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      try {
        return await user.save();
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    } else {
      throw new UnauthorizedException('User with that email not found');
    }
  }

  //LOGIN USER WITH EMAIL AND PASSWORD
  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: any }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken, user };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  //FORGOT PASSWORD
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      const resetToken = crypto.randomBytes(20).toString('hex');

      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.resetPasswordExpiration = new Date(Date.now() + 10 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      try {
        await this.mailService.sendUserConfirmation(user, resetToken);
        return { message: 'Email Sent successfully' };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new UnauthorizedException('User with that email not found');
    }
  }

  //RESET PASSWORD
  async resetPassword(resetToken: string, password: string): Promise<User> {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await this.userModel
      .findOne({
        resetPasswordToken,
        resetPasswordExpiration: { $gt: new Date() },
      })
      .exec();

    if (user) {
      if (user.resetPasswordExpiration.getTime() > Date.now()) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        try {
          return await user.save();
        } catch (err) {
          throw new InternalServerErrorException(err);
        }
      } else {
        throw new UnauthorizedException('Reset token has expired');
      }
    } else {
      throw new UnauthorizedException('Invalid reset token');
    }
  }

  //SEND MAIL TO USERS
  async sendMails(subject: string, text: string, url: string) {
    const users = await this.userModel.find().exec();
    return await this.mailService.sendNewsletter(users, subject, text, url);
  }
}
