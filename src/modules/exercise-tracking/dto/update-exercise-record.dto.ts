// src/modules/exercise-tracking/dto/update-exercise-record.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseRecordDto } from './create-exercise-record.dto';

export class UpdateExerciseRecordDto extends PartialType(CreateExerciseRecordDto) {}