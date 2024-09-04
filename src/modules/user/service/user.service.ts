// src/modules/user/service/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { HealthProfile } from '../../health/entity/health-profile.entity';
import { DietaryRestriction } from '../../nutrition/entity/dietary-restriction.entity';
import { Allergy } from '../../allergy-management/entity/allergy-management.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(HealthProfile)
    private healthProfileRepository: Repository<HealthProfile>,
    @InjectRepository(DietaryRestriction)
    private dietaryRestrictionRepository: Repository<DietaryRestriction>
  ) {}

  // 사용자를 생성하는 메서드
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // ID로 사용자를 찾는 메서드
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['healthProfiles', 'dietaryRestrictions', 'allergies']
    });
  }

  // 사용자 정보를 업데이트하는 메서드
  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  // 사용자의 건강 프로필을 생성하는 메서드
  async createHealthProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    const user = await this.findOne(userId);
    const healthProfile = this.healthProfileRepository.create({ ...profileData, user });
    return this.healthProfileRepository.save(healthProfile);
  }

  // 사용자의 식이 제한을 추가하는 메서드
  async addDietaryRestriction(userId: string, restrictionData: Partial<DietaryRestriction>): Promise<DietaryRestriction> {
    const user = await this.findOne(userId);
    const restriction = this.dietaryRestrictionRepository.create({ ...restrictionData, user });
    return this.dietaryRestrictionRepository.save(restriction);
  }

  // 사용자의 식이 제한을 조회하는 메서드
  async getUserDietaryRestrictions(userId: string): Promise<DietaryRestriction[]> {
    const user = await this.findOne(userId);
    return user.dietaryRestrictions;
  }

  // 사용자의 알레르기 정보를 조회하는 메서드
  async getUserAllergies(userId: string): Promise<Allergy[]> {
    // 사용자를 조회하고 관련된 알레르기 정보를 함께 가져옵니다.
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['allergies'],
    });
    
    // user가 null이 아닌지 확인
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    return user.allergies;
  }

  

}