// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 새로운 사용자를 생성하는 메서드
  async create(userData: Partial<User>): Promise<User> {
    // User 엔티티 인스턴스를 생성합니다.
    const user = this.userRepository.create(userData);
    // 생성된 사용자를 데이터베이스에 저장하고 반환합니다.
    return this.userRepository.save(user);
  }

  // ID로 사용자를 찾는 메서드
  async findOne(id: string): Promise<User> {
    // 지정된 ID로 사용자를 조회합니다.
    return this.userRepository.findOne({ where: { id } });
  }

  // 사용자 정보를 업데이트하는 메서드
  async update(id: string, userData: Partial<User>): Promise<User> {
    // 지정된 ID의 사용자 정보를 업데이트합니다.
    await this.userRepository.update(id, userData);
    // 업데이트된 사용자 정보를 조회하여 반환합니다.
    return this.findOne(id);
  }
}