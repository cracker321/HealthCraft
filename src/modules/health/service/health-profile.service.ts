// src/modules/health/service/health-profile.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthProfile } from '../entity/health-profile.entity';
import { User } from '../../user/entity/user.entity';
import { CreateHealthProfileDto } from '../dto/create-health-profile.dto';
import { UpdateHealthProfileDto } from '../dto/update-health-profile.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class HealthProfileService {
  constructor(
    @InjectRepository(HealthProfile)
    private healthProfileRepository: Repository<HealthProfile>,
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userId: string, createHealthProfileDto: CreateHealthProfileDto): Promise<HealthProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const healthProfile = this.healthProfileRepository.create({
      ...createHealthProfileDto,
      user
    });

  

    // BMI 계산
    healthProfile.bmi = this.calculateBMI(createHealthProfileDto.height, createHealthProfileDto.weight);

    // BMR 계산
    healthProfile.bmr = this.calculateBMR(createHealthProfileDto.height, createHealthProfileDto.weight, user.dateOfBirth, user.gender);

    return this.healthProfileRepository.save(healthProfile);
  }


     // 건강 프로필 생성 메서드
  async createProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    const user = await this.userService.findOne(userId);
    const profile = this.healthProfileRepository.create({ ...profileData, user });
    profile.calculateBMI();
    profile.calculateBMR(user.age, user.gender);
    return this.healthProfileRepository.save(profile);
  }

  // 사용자의 최신 건강 프로필 조회 메서드
  async getLatestProfile(userId: string): Promise<HealthProfile> {
    const profile = await this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
    if (!profile) {
      throw new NotFoundException('Health profile not found');
    }
    return profile;
  }

  // 건강 프로필 업데이트 메서드
  async updateProfile(profileId: string, updateData: Partial<HealthProfile>): Promise<HealthProfile> {
    const profile = await this.healthProfileRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('Health profile not found');
    }
    Object.assign(profile, updateData);
    profile.calculateBMI();
    profile.calculateBMR(profile.user.age, profile.user.gender);
    return this.healthProfileRepository.save(profile);
  }

  // 일일 칼로리 요구량 계산 메서드
  async calculateDailyCalorieNeeds(userId: string): Promise<number> {
    const profile = await this.getLatestProfile(userId);
    return profile.calculateDailyCalorieNeeds();
  }


  async update(id: string, updateHealthProfileDto: UpdateHealthProfileDto): Promise<HealthProfile> {
    const healthProfile = await this.healthProfileRepository.findOne({ where: { id } });
    if (!healthProfile) {
      throw new NotFoundException('Health profile not found');
    }

    Object.assign(healthProfile, updateHealthProfileDto);

    // BMI 재계산
    if (updateHealthProfileDto.height && updateHealthProfileDto.weight) {
      healthProfile.bmi = this.calculateBMI(updateHealthProfileDto.height, updateHealthProfileDto.weight);
    }

    // BMR 재계산
    if (updateHealthProfileDto.height || updateHealthProfileDto.weight) {
      const user = await this.userRepository.findOne({ where: { id: healthProfile.user.id } });
      healthProfile.bmr = this.calculateBMR(
        updateHealthProfileDto.height || healthProfile.height,
        updateHealthProfileDto.weight || healthProfile.weight,
        user.dateOfBirth,
        user.gender
      );
    }

    return this.healthProfileRepository.save(healthProfile);
  }

  async findLatestByUserId(userId: string): Promise<HealthProfile> {
    return this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  private calculateBMI(height: number, weight: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  private calculateBMR(height: number, weight: number, dateOfBirth: Date, gender: string): number {
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }
}