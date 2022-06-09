import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWebdevDto {
  @IsString()
  @IsNotEmpty()
  plateform: string;

  @IsString()
  @IsNotEmpty()
  typeapp: string;

  @IsString()
  @IsNotEmpty()
  appname: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  design: string[];
  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  functionnality: string;
}
