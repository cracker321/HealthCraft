import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User } from './entity/user.entity';
import { HealthProfile } from '../health/entity/health-profile.entity';
import { DietaryRestriction } from '../dietary-restriction/entity/dietary-restriction.entity';
import { HealthModule } from '../health/health.module';
import { DietaryRestrictionModule } from '../dietary-restriction/dietary-restriction.module';

@Module({
  imports: [
    // User, HealthProfile, DietaryRestriction 엔티티를 TypeORM에 등록
    TypeOrmModule.forFeature([User, HealthProfile, DietaryRestriction]),
    // HealthModule과 DietaryRestrictionModule을 import, 순환 종속성 방지를 위해 forwardRef 사용
    forwardRef(() => HealthModule),
    forwardRef(() => DietaryRestrictionModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
