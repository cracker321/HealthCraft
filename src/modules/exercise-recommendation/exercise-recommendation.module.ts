// src/modules/exercise-recommendation/exercise-recommendation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseRecommendation } from './entity/exercise-recommendation.entity';
import { ExerciseRecommendationService } from './service/exercise-recommendation.service';
import { UserModule } from '../user/user.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseRecommendation]),
    UserModule,
    HealthModule,
  ],
  providers: [ExerciseRecommendationService],
  exports: [ExerciseRecommendationService],
})
export class ExerciseRecommendationModule {}