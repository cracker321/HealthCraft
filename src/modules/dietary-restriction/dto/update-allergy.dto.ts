// src/modules/dietary-restriction/dto/update-allergy.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAllergyDto } from './create-allergy.dto';

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {}