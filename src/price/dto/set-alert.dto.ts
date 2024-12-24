import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({ example: 'ethereum' })
  @IsString()
  chain: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}