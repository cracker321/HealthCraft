// src/modules/dietary-restriction/dietary-restriction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaryRestrictionService } from './service/dietary-restriction.service';
import { DietaryRestrictionController } from './controller/dietary-restriction.controller';
import { DietaryRestriction } from './entity/dietary-restriction.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([DietaryRestriction]), UserModule],
  controllers: [DietaryRestrictionController],
  providers: [DietaryRestrictionService],
  exports: [DietaryRestrictionService]
})
export class DietaryRestrictionModule {}