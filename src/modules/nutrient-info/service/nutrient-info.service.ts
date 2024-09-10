// src/modules/supplement/service/supplement.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplementRecommendation } from '../../supplement-recommendation/entity/supplement-recommendation.entity';
import { NutrientInfo } from '../entity/nutrient-info.entity';

@Injectable()
export class SupplementService {
  constructor(
    // 각 보충제 관련 엔티티에 대한 TypeORM 리포지토리를 주입받음.
    @InjectRepository(SupplementRecommendation)
    private supplementRecommendationRepository: Repository<SupplementRecommendation>,
    @InjectRepository(NutrientInfo)
    private nutrientInfoRepository: Repository<NutrientInfo>,
  ) {}

  // 영양제를 추천하는 메서드
  async recommendSupplements(userId: string, healthData: any): Promise<SupplementRecommendation[]> {
    // TODO: 사용자의 건강 데이터를 기반으로 영양제를 추천하는 로직을 구현해야 함.
    const recommendations = await this.supplementRecommendationRepository.find({ where: { /* 조건 추가 */ } });
    return recommendations;
  }

  // 특정 영양소의 정보를 조회하는 메서드
  async getNutrientInfo(nutrientId: string): Promise<NutrientInfo> {
    // 지정된 ID의 영양소 정보를 조회하여 반환.
    return this.nutrientInfoRepository.findOne({ where: { id: nutrientId } });
  }
}