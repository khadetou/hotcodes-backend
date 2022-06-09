import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarketingDto {
  @IsNumber()
  @IsNotEmpty()
  nombreClient: number;

  @IsString()
  @IsNotEmpty()
  besoinClients: string;

  @IsString()
  @IsNotEmpty()
  genresClient: string;

  @IsNumber()
  @IsNotEmpty()
  ageMoyen: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  moyenVentes: string;

  @IsString()
  @IsNotEmpty()
  problemeVente: string;

  @IsString()
  @IsNotEmpty()
  nombreProduits: string;
}
