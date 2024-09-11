import { IsArray, IsString } from 'class-validator';

export class SupplementRecommendationRequestDto {
  @IsArray({ message: '건강 이슈는 배열 형태여야 합니다.' })
  @IsString({ each: true, message: '각 건강 이슈는 문자열이어야 합니다.' })
  healthIssues: string[];

  @IsArray({ message: '식이 제한은 배열 형태여야 합니다.' })
  @IsString({ each: true, message: '각 식이 제한은 문자열이어야 합니다.' })
  dietaryRestrictions: string[];
}