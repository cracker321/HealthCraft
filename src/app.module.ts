import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { SupplementRecommendationModule } from './modules/supplement-recommendation/supplement-recommendation.module';
import { DietaryRestrictionModule } from './modules/dietary-restriction/dietary-restriction.module';

@Module({
  imports: [
    // 환경 변수 설정 모듈을 전역으로 설정
    ConfigModule.forRoot({
      isGlobal: true,  // ConfigModule을 전역 모듈로 사용
    }),

    // 데이터베이스 연결 설정: 환경 변수를 통해 동적으로 설정
    // TypeORM을 설정합니다. forRootAsync는 비동기 방식으로 환경 변수를 로드하여 설정에 반영합니다.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // ConfigModule에서 환경 변수를 가져옴
      inject: [ConfigService],  // ConfigService를 주입하여 환경 변수 사용 가능
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',  // MySQL 데이터베이스 사용
        host: configService.get<string>('DB_HOST'),  // .env에서 DB_HOST 값 가져오기
        port: configService.get<number>('DB_PORT'),  // .env에서 DB_PORT 값 가져오기 // DB 포트 설정
        username: configService.get<string>('DB_USERNAME'),  // .env에서 DB_USERNAME 값 가져오기 // DB 사용자명
        password: configService.get<string>('DB_PASSWORD'),  // .env에서 DB_PASSWORD 값 가져오기 // DB 비밀번호
        database: configService.get<string>('DB_NAME'),  // .env에서 DB_NAME 값 가져오기 // 사용할 데이터베이스
        entities: [__dirname + '/**/*.entity{.ts,.js}'],  // 엔티티 자동 로드
        synchronize: configService.get<string>('NODE_ENV') !== 'production',  // 개발 환경에서만 동기화 활성화
      }),
    }),

    // 애플리케이션에서 사용하는 모듈들을 등록
    AuthModule,  // 인증 관련 모듈
    UserModule,  // 사용자 관리 관련 모듈
    HealthModule,  // 건강 관련 모듈
    NutritionModule,  // 영양 분석 및 추천 관련 모듈
    SupplementRecommendationModule,  // 영양제 추천 모듈
    DietaryRestrictionModule,  // 식이 제한 관련 모듈
  ],
})
export class AppModule {}
