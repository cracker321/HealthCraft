// src/modules/health/service/health-profile.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthProfile } from '../entity/health-profile.entity';
import { User } from '../../user/entity/user.entity';
import { CreateHealthProfileDto } from '../dto/create-health-profile.dto';
import { UpdateHealthProfileDto } from '../dto/update-health-profile.dto';

@Injectable()
export class HealthProfileService {
  constructor(
    @InjectRepository(HealthProfile)
    private healthProfileRepository: Repository<HealthProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userId: string, createHealthProfileDto: CreateHealthProfileDto): Promise<HealthProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const healthProfile = this.healthProfileRepository.create({
      ...createHealthProfileDto,
      user
    });
    return this.healthProfileRepository.save(healthProfile);
  }

  async update(id: string, updateHealthProfileDto: UpdateHealthProfileDto): Promise<HealthProfile> {
    const healthProfile = await this.healthProfileRepository.findOne({ where: { id } });
    if (!healthProfile) {
      throw new Error('Health profile not found');
    }
    Object.assign(healthProfile, updateHealthProfileDto);
    return this.healthProfileRepository.save(healthProfile);
  }

  async findLatestByUserId(userId: string): Promise<HealthProfile> {
    return this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }
}