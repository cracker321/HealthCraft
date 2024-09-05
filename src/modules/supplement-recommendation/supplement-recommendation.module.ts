// src/modules/supplement-recommendation/supplement-recommendation.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplementRecommendationService } from './service/supplement-recommendation.service';
import { SupplementRecommendationController } from './controller/supplement-recommendation.controller';
import { SupplementRecommendation } from './entity/supplement-recommendation.entity';
import { UserModule } from '../user/user.module';
import { NutritionModule } from '../nutrition/nutrition.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplementRecommendation]),
    UserModule,
    NutritionModule,
  ],
  providers: [SupplementRecommendationService],
  controllers: [SupplementRecommendationController],
  exports: [SupplementRecommendationService],
})
export class SupplementRecommendationModule {}