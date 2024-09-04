// src/modules/user/service/user.service.ts


import { Injectable } from '@nestjs/common';
// - NestJS 의 'Injectable 기능'을 '@nestjs/common 패키지'로부터 불러와서, 
//   '다른 외부 클래스들'이 이 'UserService 서비스'를 사용할 수 있도록 등록해주는 역할을 함.
//   NestJS 프레임워크에서 제공하는 '@Injectable 데코레이터'르 가져오는 코드임.
//   의존성주입 DI 를 위해 사용됨.
// - 비유하자면, 만약 우리가 한 마을에 살고 있고, 특정 전문가를 찾고 있다고 상상해 보자.
//   예를 들어, 마을에서 누구든지 언제든지 이용할 수 있는 의사를 생각해보자. 
//   그 의사에게 "당신은 언제든지 호출될 준비가 되었습니다."라고 명시해두는 게 바로 이 @Injectable이야. 
//   그 의사는 이제 마을 주민들이 언제든지 불러서 사용할 수 있는 상태가 된 거지.

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {


  constructor(
    // User 엔티티에 대한 TypeORM 리포지토리를 주입받습니다.
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 새로운 사용자를 생성하는 메서드
  async create(userData: Partial<User>): Promise<User> {
    // User 엔티티의 인스턴스를 생성합니다.
    const user = this.userRepository.create(userData);
    // 생성된 사용자 정보를 데이터베이스에 저장하고 그 결과를 반환합니다.
    return this.userRepository.save(user);
  }

  // ID로 사용자를 찾는 메서드
  async findOne(id: string): Promise<User> {
    // 주어진 ID로 사용자를 데이터베이스에서 조회합니다.
    return this.userRepository.findOne({ where: { id } });
  }

  // 사용자 정보를 업데이트하는 메서드
  async update(id: string, userData: Partial<User>): Promise<User> {
    // 주어진 ID의 사용자 정보를 업데이트합니다.
    await this.userRepository.update(id, userData);
    // 업데이트된 사용자 정보를 조회하여 반환합니다.
    return this.findOne(id);
  }
}