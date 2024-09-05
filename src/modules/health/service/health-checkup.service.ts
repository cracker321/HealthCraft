// src/modules/health/service/health-checkup.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheckup } from '../entity/health-checkup.entity';
import { User } from '../../user/entity/user.entity';
import { CreateHealthCheckupDto } from '../dto/create-health-checkup.dto';

@Injectable()
export class HealthCheckupService {
  constructor(
    @InjectRepository(HealthCheckup)
    private healthCheckupRepository: Repository<HealthCheckup>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userId: string, createHealthCheckupDto: CreateHealthCheckupDto): Promise<HealthCheckup> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const healthCheckup = this.healthCheckupRepository.create({
      ...createHealthCheckupDto,
      user
    });
    return this.healthCheckupRepository.save(healthCheckup);
  }

  async findLatestByUserId(userId: string): Promise<HealthCheckup> {
    return this.healthCheckupRepository.findOne({
      where: { user: { id: userId } },
      order: { checkupDate: 'DESC' }
    });
  }
}