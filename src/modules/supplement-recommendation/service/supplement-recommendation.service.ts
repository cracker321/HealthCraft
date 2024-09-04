// src/modules/supplement-recommendation/service/supplement-recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplementRecommendation } from '../entity/supplement-recommendation.entity';
import { UserService } from '../../user/service/user.service';
import { NutritionAnalysisService } from '../../nutrition-analysis/service/nutrition-analysis.service';
import { HealthProfile } from '../../health/entity/health-profile.entity';

@Injectable()
export class SupplementRecommendationService {
  constructor(
    @InjectRepository(SupplementRecommendation)
    private supplementRecommendationRepository: Repository<SupplementRecommendation>,
    private userService: UserService,
    private nutritionAnalysisService: NutritionAnalysisService
  ) {}

  // 개인화된 영양제 추천 메서드
  async recommendSupplements(userId: string): Promise<SupplementRecommendation[]> {
    const user = await this.userService.findOne(userId);
    const nutritionAnalysis = await this.nutritionAnalysisService.analyzeNutritionIntake(userId, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    // 영양 분석 결과를 바탕으로 부족한 영양소를 식별
    const deficientNutrients = this.identifyDeficientNutrients(nutritionAnalysis);

    // 부족한 영양소를 보충할 수 있는 영양제 추천
    return this.findSuitableSupplements(deficientNutrients, user.currentHealthProfile);
  }

  private identifyDeficientNutrients(nutritionAnalysis: any): string[] {
    // 영양 분석 결과를 바탕으로 부족한 영양소를 식별하는 로직
    const deficientNutrients: string[] = [];
    if (nutritionAnalysis.vitaminC < 60) deficientNutrients.push('Vitamin C');
    if (nutritionAnalysis.calcium < 1000) deficientNutrients.push('Calcium');
    // 기타 영양소 체크...
    return deficientNutrients;
  }

  private async findSuitableSupplements(deficientNutrients: string[], healthProfile: HealthProfile): Promise<SupplementRecommendation[]> {
    const suitableSupplements: SupplementRecommendation[] = [];
    for (const nutrient of deficientNutrients) {
      const supplements = await this.supplementRecommendationRepository.find({
        where: { targetNutrient: nutrient }
      });
      const filteredSupplements = supplements.filter(supplement => 
        this.isSupplementSuitable(supplement, healthProfile)
      );
      suitableSupplements.push(...filteredSupplements);
    }
    return suitableSupplements;
  }

  private isSupplementSuitable(supplement: SupplementRecommendation, healthProfile: HealthProfile): boolean {
    // 건강 프로필을 고려하여 영양제의 적합성을 판단하는 로직
    // 예: 나이, 성별, 건강 상태 등을 고려
    // 실제 구현시 더 복잡한 로직이 필요할 수 있음
    return true; // 임시 반환값
  }

  // 영양제 복용 일정 생성 메서드
  async createSupplementSchedule(userId: string, supplementId: string): Promise<any> {
    const supplement = await this.supplementRecommendationRepository.findOne({ where: { id: supplementId } });
    if (!supplement) {
      throw new Error('영양제를 찾을 수 없습니다.');
    }
    // 영양제 복용 일정 생성 로직
    const schedule = {
      userId,
      supplementId: supplement.id,
      supplementName: supplement.supplementName,
      dosage: supplement.recommendedDosage,
      frequency: 'daily', // 예시 값
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
    };
    // 실제로는 이 스케줄을 데이터베이스에 저장해야 함
    return schedule;
  }
}