// src/modules/dietary-restriction/dietary-restriction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DietaryRestriction } from '../entity/dietary-restriction.entity';
import { CreateDietaryRestrictionDto } from '../dto/create-dietary-restriction.dto';
import { UpdateDietaryRestrictionDto } from '../dto/update-dietary-restriction.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class DietaryRestrictionService {
  constructor(
    @InjectRepository(DietaryRestriction)
    private dietaryRestrictionRepository: Repository<DietaryRestriction>,
    private userService: UserService
  ) {}

  

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