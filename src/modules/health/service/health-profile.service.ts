import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthProfile } from '../entity/health-profile.entity';
import { User } from '../../user/entity/user.entity';
import { CreateHealthProfileDto } from '../dto/create-health-profile.dto';
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
      throw new NotFoundException('해당하는 사용자가 없습니다');
    }

    const healthProfile = this.healthProfileRepository.create({
      ...createHealthProfileDto,
      user
    });


    // BMI 계산
    healthProfile.bmi = this.calculateBMI(createHealthProfileDto.height, createHealthProfileDto.weight);


    return this.healthProfileRepository.save(healthProfile);
  }


     // 건강 프로필 생성 메서드
  async createProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    const user = await this.userService.findOne(userId);
    const profile = this.healthProfileRepository.create({ ...profileData, user });
    profile.calculateBMI();
    return this.healthProfileRepository.save(profile);
  }

  // 사용자의 최신 건강 프로필 조회 메서드
  async getLatestProfile(userId: string): Promise<HealthProfile> {
    const profile = await this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
    if (!profile) {
      throw new NotFoundException('사용자의 건강 프로필이 존재하지 않습니다.');
    }
    return profile;
  }

  // 건강 프로필 업데이트 메서드
  async updateProfile(profileId: string, updateData: Partial<HealthProfile>): Promise<HealthProfile> {
    const profile = await this.healthProfileRepository.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException('사용자의 건강 프로필이 존재하지 않습니다.');
    }
    Object.assign(profile, updateData);
    profile.calculateBMI();
    return this.healthProfileRepository.save(profile);
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

  
}