// src/modules/exercise-tracking/dto/create-exercise-record.dto.ts
import { IsNotEmpty, IsNumber, Min, IsDate, IsEnum, IsOptional } from 'class-validator';

export class CreateExerciseRecordDto {
  @IsNotEmpty({ message: '운동 종류는 필수입니다.' })
  exerciseType: string;

  @IsNumber({}, { message: '운동 시간은 숫자여야 합니다.' })
  @Min(1, { message: '운동 시간은 1분 이상이어야 합니다.' })
  duration: number;

  @IsNumber({}, { message: '소모 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '소모 칼로리는 0 이상이어야 합니다.' })
  caloriesBurned: number;

  @IsEnum(['low', 'moderate', 'high'], { message: '유효한 운동 강도를 선택해주세요.' })
  intensity: string;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  exerciseDate: Date;

  @IsOptional()
  notes?: string;

  @IsOptional()
  metrics?: { [key: string]: number };
}