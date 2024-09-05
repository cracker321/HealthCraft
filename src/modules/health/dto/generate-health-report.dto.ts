// src/modules/health/dto/generate-health-report.dto.ts

import { IsString, IsDate } from 'class-validator';

export class GenerateHealthReportDto {
  @IsString()
  userId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}