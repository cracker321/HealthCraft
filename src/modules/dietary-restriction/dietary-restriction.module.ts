import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaryRestrictionService } from './service/dietary-restriction.service';
import { DietaryRestrictionController } from './controller/dietary-restriction.controller';
import { DietaryRestriction } from './entity/dietary-restriction.entity';
import { UserModule } from '../user/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([DietaryRestriction]),
    forwardRef(() => UserModule),  // 순환 종속성을 해결하기 위해 forwardRef 사용
  ],
  controllers: [DietaryRestrictionController],
  providers: [DietaryRestrictionService],
  exports: [DietaryRestrictionService],
})
export class DietaryRestrictionModule {}
