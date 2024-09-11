import { IsString, IsDate } from 'class-validator';

export class GenerateHealthReportDto {
  @IsString()
  userId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}