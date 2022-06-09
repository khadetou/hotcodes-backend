import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMobiledevDto {
  @IsString()
  @IsNotEmpty()
  plateform: string;

  @IsString()
  @IsNotEmpty()
  typeapp: string;

  @IsString()
  @IsNotEmpty()
  appName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  Goal: string;

  @IsString()
  @IsNotEmpty()
  design: string;

  @IsString()
  @IsNotEmpty()
  functionnality: string;
}
