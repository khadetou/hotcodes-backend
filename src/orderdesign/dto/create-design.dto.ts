import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDesignDto {
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
  target: string;

  @IsString()
  @IsNotEmpty()
  moodBoard: string;

  @IsString()
  @IsNotEmpty()
  wireframe: string;

  @IsString()
  @IsNotEmpty()
  functionnality: string;

  design: any;
}
