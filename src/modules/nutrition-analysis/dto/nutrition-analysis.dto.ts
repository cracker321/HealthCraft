import { IsString, IsNumber, IsArray } from 'class-validator';

export class NutritionAnalysisDto {
  @IsString()
  userId: string;

  @IsNumber()
  totalCalories: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;

  @IsArray()
  vitamins: { name: string, amount: number }[];

  @IsArray()
  minerals: { name: string, amount: number }[];
}