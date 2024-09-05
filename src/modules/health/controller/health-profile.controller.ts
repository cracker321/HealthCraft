// src/modules/health/controller/health-profile.controller.ts

import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { HealthProfileService } from '../service/health-profile.service';
import { CreateHealthProfileDto } from '../dto/create-health-profile.dto';
import { UpdateHealthProfileDto } from '../dto/update-health-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('health-profile')
@UseGuards(JwtAuthGuard)
export class HealthProfileController {
  constructor(private readonly healthProfileService: HealthProfileService) {}

  @Post(':userId')
  async create(@Param('userId') userId: string, @Body() createHealthProfileDto: CreateHealthProfileDto) {
    return this.healthProfileService.create(userId, createHealthProfileDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHealthProfileDto: UpdateHealthProfileDto) {
    return this.healthProfileService.update(id, updateHealthProfileDto);
  }

  @Get('latest/:userId')
  async getLatest(@Param('userId') userId: string) {
    return this.healthProfileService.findLatestByUserId(userId);
  }
}