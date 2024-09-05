// src/modules/health/dto/create-health-checkup.dto.ts

import { IsNumber, IsDate, Min, Max } from 'class-validator';

export class CreateHealthCheckupDto {
  @IsNumber()
  @Min(0, { message: '체중은 0kg 이상이어야 합니다.' })
  @Max(500, { message: '체중은 500kg 이하여야 합니다.' })
  weight: number;

  @IsNumber()
  @Min(0, { message: '혈압(수축기)은 0 이상이어야 합니다.' })
  @Max(300, { message: '혈압(수축기)은 300 이하여야 합니다.' })
  systolicBP: number;

  @IsNumber()
  @Min(0, { message: '혈압(이완기)은 0 이상이어야 합니다.' })
  @Max(200, { message: '혈압(이완기)은 200 이하여야 합니다.' })
  diastolicBP: number;

  @IsNumber()
  @Min(0, { message: '총 콜레스테롤은 0 이상이어야 합니다.' })
  totalCholesterol: number;

  @IsNumber()
  @Min(0, { message: '공복혈당은 0 이상이어야 합니다.' })
  fastingBloodSugar: number;

  @IsDate()
  checkupDate: Date;
}
