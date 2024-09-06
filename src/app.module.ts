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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // ConfigModule에서 환경 변수를 가져옴
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',  // MySQL 데이터베이스 사용
        host: configService.get<string>('DB_HOST'),  // DB 호스트 설정
        port: configService.get<number>('DB_PORT'),  // DB 포트 설정
        username: configService.get<string>('DB_USERNAME'),  // DB 사용자명
        password: configService.get<string>('DB_PASSWORD'),  // DB 비밀번호
        database: configService.get<string>('DB_NAME'),  // 사용할 데이터베이스 이름
        entities: [__dirname + '/**/*.entity{.ts,.js}'],  // 엔티티 자동 로드
        synchronize: configService.get<string>('NODE_ENV') !== 'production',  // 개발 환경에서만 동기화 활성화
      }),
      inject: [ConfigService],
    }),

    // 애플리케이션에서 사용하는 모듈들을 등록
    AuthModule,
    UserModule,
    HealthModule,
    NutritionModule,
    SupplementRecommendationModule,
    DietaryRestrictionModule,
  ],
})
export class AppModule {}
