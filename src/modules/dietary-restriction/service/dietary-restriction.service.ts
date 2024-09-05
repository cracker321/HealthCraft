// src/modules/dietary-restriction/dietary-restriction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergy } from '../../allergy-management/entity/allergy-management.entity';
import { DietaryRestriction } from '../entity/dietary-restriction.entity';
import { CreateAllergyDto } from '../dto/create-allergy.dto';
import { UpdateAllergyDto } from '../dto/update-allergy.dto';
import { CreateDietaryRestrictionDto } from '../dto/create-dietary-restriction.dto';
import { UpdateDietaryRestrictionDto } from '../dto/update-dietary-restriction.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class DietaryRestrictionService {
  constructor(
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
    @InjectRepository(DietaryRestriction)
    private dietaryRestrictionRepository: Repository<DietaryRestriction>,
    private userService: UserService
  ) {}

  // 알레르기 생성
  async createAllergy(createAllergyDto: CreateAllergyDto): Promise<Allergy> {
    const user = await this.userService.findOne(createAllergyDto.userId);
    const allergy = this.allergyRepository.create({
      ...createAllergyDto,
      user
    });
    return this.allergyRepository.save(allergy);
  }

  // 사용자의 모든 알레르기 조회
  async findAllAllergiesByUser(userId: string): Promise<Allergy[]> {
    return this.allergyRepository.find({ where: { user: { id: userId } } });
  }

  // 알레르기 업데이트
  async updateAllergy(id: string, updateAllergyDto: UpdateAllergyDto): Promise<Allergy> {
    await this.allergyRepository.update(id, updateAllergyDto);
    return this.allergyRepository.findOne({ where: { id } });
  }

  // 알레르기 삭제
  async removeAllergy(id: string): Promise<void> {
    await this.allergyRepository.delete(id);
  }

  // 알레르기 요약 정보 생성
  async getAllergySummary(id: string): Promise<string> {
    const allergy = await this.allergyRepository.findOne({ where: { id } });
    return allergy.generateSummary();
  }

  // 알레르기 응급 정보 생성
  async getAllergyEmergencyInfo(id: string): Promise<string> {
    const allergy = await this.allergyRepository.findOne({ where: { id } });
    return allergy.generateEmergencyInfo();
  }

  // 식이 제한 생성
  async create(userId: string, createDietaryRestrictionDto: CreateDietaryRestrictionDto): Promise<DietaryRestriction> {
    const user = await this.userService.findOne(userId);
    const dietaryRestriction = this.dietaryRestrictionRepository.create({
      ...createDietaryRestrictionDto,
      user
    });
    return this.dietaryRestrictionRepository.save(dietaryRestriction);
  }

  // 사용자의 모든 식이 제한 조회
  async findAllByUser(userId: string): Promise<DietaryRestriction[]> {
    return this.dietaryRestrictionRepository.find({ where: { user: { id: userId } } });
  }

  // 특정 식이 제한 조회
  async findOne(id: string): Promise<DietaryRestriction> {
    return this.dietaryRestrictionRepository.findOne({ where: { id } });
  }

  // 식이 제한 업데이트
  async update(id: string, updateDietaryRestrictionDto: UpdateDietaryRestrictionDto): Promise<DietaryRestriction> {
    await this.dietaryRestrictionRepository.update(id, updateDietaryRestrictionDto);
    return this.findOne(id);
  }

  // 식이 제한 삭제
  async remove(id: string): Promise<void> {
    await this.dietaryRestrictionRepository.delete(id);
  }
}