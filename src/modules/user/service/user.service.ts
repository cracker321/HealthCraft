// src/modules/user/service/user.service.ts


import { Injectable } from '@nestjs/common';
// - NestJS 의 'Injectable 기능'을 '@nestjs/common 패키지'로부터 불러와서, 
//   '다른 외부 클래스들(e.g: 다른 서비스 또는 컨트롤러 등)'이 이 'UserService 서비스'를 사용할 수 있도록 등록해주는 역할을 함.
// - NestJS 프레임워크에서 제공하는 '@Injectable 데코레이터'를 가져오는 코드임.
//   의존성주입 DI 를 위해 사용됨.
// - 비유하자면, 만약 우리가 한 마을에 살고 있고, 특정 전문가를 찾고 있다고 상상해 보자.
//   예를 들어, 마을에서 누구든지 언제든지 이용할 수 있는 의사('UserService 서비스')를 생각해보자.
//   그 의사('UserService 서비스')에게 "당신은 언제든지 호출될 준비가 되었습니다."라고 명시해두는 게 바로 이 @Injectable 임.
//   그 의사('UserService 서비스')는 이제 마을 주민들이 언제든지 불러서 사용할 수 있는 상태가 된 것임.

import { InjectRepository } from '@nestjs/typeorm';
// - NestJS 의 '@nestjs/typeorm 패키지'로부터 '@InjectRepository 데코레이터'를 불러오는 것.
//   TypeORM 은 DB와 상호작용하는 ORM 도구로, 이 @InjectRepository 데코레이터는 
//   '특정 엔티티와 연결된 리포지터리를 다른 곳에 주입할 수 있도록' 설정해줌.
// - 비유하자면, 리포지토리는 마치 우리가 도서관에서 책을 빌리고 반납할 수 있도록 만들어주는 '도서 대출 시스템'과 같음.
//   도서관에 가면 책이 어딨는지 찾기 어렵지만, 대출 시스템을 사용하면 책을 쉽게 찾고 빌릴 수 있음.
//   여기서 InjectRepository는 데이터베이스라는 도서관에서 정보를 쉽게 찾을 수 있도록 해주는 도구를 가져오는 것임.


import { Repository } from 'typeorm';
// - TypeORM 의 '내부 클래스 Repository'를 가져오는 부분.
//   TypeORM 은 DB 에 있는 정보들을 객체 Object 처럼 다룰 수 있게 해주는데, 
//   그 객체를 직접 저장, 불러오고, 삭제 등 할 수 있게 해주는 도구가 바로 Repository


import { User } from '../entity/user.entity';
// - 'User 엔티티'를 가져옴.


// - '@Injectable'
//   : - 이 'UserService 서비스'를 '다른 외부 클래스들'에서 사용할 수 있도록 해주는 데코레이터 @Injectable.
//     - NestJS 에서 '모든 Service 클래스들'이 '다른 외부 클래스, 컨트롤러 등'에서 호출될 수 있기 위해서는,
//       그 서비스 클래스 위에 @Injectable 을 붙여줘야 한다!!
//       이를 통해 NestJS 가 이 서비스 클래스를 DI 시스템에서 사용할 수 있게 준비해주는 것임!
//       만약 이 @Injectable 데코레이터가 없다면, 이 서비스는 다른 외부 클래스, 컨트롤러 등에서는 사용할 수 없다!
@Injectable()
export class UserService {



  // < 생성자 함수 >

  // - 'consutructor()
  //   : - 이 클래스가 생성될 때 자동으로 호출 실행되는 함수.
  //     - 비유하자면, 만약 새 컴퓨터를 너가 처음 만들었다고 상상해볼 때,
  //       그 컴퓨터를 처음 켜면, 시스템을 설정하는 여러 초기 작업들이 필요한데,
  //       바로 그 역할을 하는 것이 생성자 함수임. 컴퓨터가 켜지는 순간, 바로 실행되는 초기 설정임.
  // - '@InjectRepository(User)'
  //   : - 'User 엔티티와 연결된 리포지토리'를 가져오는 코드.
  //       엔티티는 DB 에서 사용자 User 정보가 어떻게 생겼는지 정의하는 설계도이고,
  //       여기서는 그 설계도('엔티티')에 맞춰 사용자 User 정보를 다룰 수 있는 '도구(Reository)'를 가져오겠다는 것임.
  //       즉, '변수 userRepository'를 User 엔티티와 연결된 리포지토리로 주입하여 사용하겠다는 의미임.
  // - 'private userRepository: Repository<User>'
  //   : - '변수 userRepository'를 'User 엔티티'와 관련된 리포지토리로 설정하는 것임.
  //       이제는 이 변수 userRepository 가 이후의 함수들 안에서 계속해서 사용자 User 데이터를 관리하는 데 사용되는 것임.
  constructor(
    // User 엔티티에 대한 TypeORM 리포지토리를 주입받습니다.
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}




  // ===============================================================================================================



  // < 새로운 사용자를 생성하는 메소드 create() >
  

  // - 'async'
  //   : - 'async 키워드'는 '비동기적으로 작동하는 함수를 정의할 때 사용됨'.
  //       즉, DB 작업처럼 시간이 오래 걸릴 수 있는 작업을 수행할 때, 그 작업이 완료될 때까지 기다리지 않고,
  //       이 함수가 다른 작업을 처리할 수 있도록 도와줌.
  //     - 비유하자면, 마치 빨래를 돌리면서 요리를 하는 것과 같음.
  //       빨래가 다 마를 때까지 그냥 기다리기보다, 그 시간을 활용해서 다른 일을 할 수 있도록 하는 것임.
  //       ***중요***
  //       이 '메소드 create'도 비동기적으로 동작하므로, 다른 작업이 동시에 진행될 수 있음.
  // - 'create()'
  //   : 새로운 사용자 User 객체를 생성하고, 이를 DB 에 저장하는 역할.
  // ***중요***
  // - 'userData'
  //   : - 새로운 사용자 User 의 정보를 담고 있는 객체를 포함하고 있는 '변수'.
  //     - userData 는 '실제 웹서비스 사용자'가 브라우저 화면에서 입력한 데이터로 생성되는 것임!
  //       예를 들어, 웹서비스 실제 사용자가 회원가입 양식에서 이름, 이메일, 비밀번호를 입력하면,
  //       이 실제 사용자가 화면에서 입력한 데이터가 서버로 전달되고, 
  //       이후 그것이 create() 메소드로 넘어오게 되는 것임.ㄷ
  // - 'Partial<User>'
  //   : - 여기서 Partial 은 사용자 User 정보의 '일부'만 전달받아도 괜찮고,
  //       그 '사용자의 일부 정보'만으로도 새로운 사용자 User 객체를 생성할 수 있다는 의미임.
  //       ***중요***
  //       즉, 실제 웹서비스의 사용자가 화면에서 User 엔티티에 정의된 필드들을 모두 입력하지 않아도 되는 것이다!!
  //     - 비유하자면, 친구의 정보 일부만 받아서 그 친구들 내 친구 목록에 추가하는 것과 같음.
  //       그 친구의 이름과 이메일만 알고 있고, 나머지 정보는 몰라도
  //       그 친구를 내 친구목록(= DB)에 등록할 수 있는 것과 같은 원리임.
  // - 'Promise<User>'
  //   : - 이 메소드 create 가 실행된 후, 미래에서 '반.드.시 User 객체가 반환될 것을 약속'해주는 것임.
  //       즉, 이 메소드 create 의 실행이 끝난 뒤, 그 사용자 User 가 DB 에서 찾아진다면, 
  //       나중에 그 사용자 User 정보 객체를 반환한다는 의미임.
  //     - 'Promise'는 비동기 작업에서 매우 중요한 개념으로,
  //       메소드가 작업을 완료할 때까지 기다리고 그 결과를 반환하는 것임.
  //     - 비유하자면, 마치 내가 도서관에서 사서에게 책을 찾아달라고 요청하고, 사서가 내가 요청한 그 책을 찾으면,
  //       내게 그 책을 가져다줄 것을 약속하는 것임.
  async create(userData: Partial<User>): Promise<User> {



    // User 엔티티의 인스턴스를 생성합니다.
    
    // - 'this.userRepository.create(userData)'
    //   : - 전달받은 '새로운 사용자 User 정보를 담고 있는 객체 userData'를 사용하여
    //     - 'this'
    //       : 현재 클래스의 인스턴스(객체)를 가리킴.
    //     - 'userRepository'
    //       : TypeORM 에서 제공하는 DB 와 상호작용하는 리포지토리.
    //         DB 에서 사용자를 추가, 조회, 수정, 삭제 하는 기능을 제공함. 
    // - 'const user'
    //   : 새로 만들어진 
    const user = this.userRepository.create(userData);
    // 생성된 사용자 정보를 데이터베이스에 저장하고 그 결과를 반환합니다.
    return this.userRepository.save(user);
  }


  // ===============================================================================================================


  // ID로 사용자를 찾는 메서드
  async findOne(id: string): Promise<User> {
    // 주어진 ID로 사용자를 데이터베이스에서 조회합니다.
    return this.userRepository.findOne({ where: { id } });
  }


  // ===============================================================================================================



  // 사용자 정보를 업데이트하는 메서드
  async update(id: string, userData: Partial<User>): Promise<User> {
    // 주어진 ID의 사용자 정보를 업데이트합니다.
    await this.userRepository.update(id, userData);
    // 업데이트된 사용자 정보를 조회하여 반환합니다.
    return this.findOne(id);
  }
}