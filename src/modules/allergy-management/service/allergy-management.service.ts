// src/modules/allergy-management/service/allergy-management.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergy } from '../entity/allergy-management.entity';
import { DietaryRestriction } from '../entity/dietary-restriction.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AllergyManagementService {
  constructor(
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
    @InjectRepository(DietaryRestriction)
    private dietaryRestrictionRepository: Repository<DietaryRestriction>,
    private userService: UserService
  ) {}

  // 알레르기 정보 추가 메서드
  async addAllergy(userId: string, allergyData: Partial<Allergy>): Promise<Allergy> {
    const user = await this.userService.findOne(userId);
    const allergy = this.allergyRepository.create({ ...allergyData, user });
    return this.allergyRepository.save(allergy);
  }

  // 식이 제한 정보 추가 메서드
  async addDietaryRestriction(userId: string, restrictionData: Partial<DietaryRestriction>): Promise<DietaryRestriction> {
    const user = await this.userService.findOne(userId);
    const restriction = this.dietaryRestrictionRepository.create({ ...restrictionData, user });
    return this.dietaryRestrictionRepository.save(restriction);
  }

  // 사용자의 알레르기 및 식이 제한 정보 조회 메서드
  async getUserAllergiesAndRestrictions(userId: string): Promise<{ allergies: Allergy[], dietaryRestrictions: DietaryRestriction[] }> {
    const user = await this.userService.findOne(userId);
    return {
      allergies: user.allergies,
      dietaryRestrictions: user.dietaryRestrictions
    };
  }
}