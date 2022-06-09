import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthUpdateCredentialsDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsNumber()
  phone: string;
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
