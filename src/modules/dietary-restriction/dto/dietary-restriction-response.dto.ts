import { Exclude, Expose } from 'class-transformer';

export class DietaryRestrictionResponseDto {
  @Expose()
  id: string;

  @Expose()
  restrictionType: string;

  @Expose()
  reason: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate?: Date;

  @Exclude()
  userId: string;
}