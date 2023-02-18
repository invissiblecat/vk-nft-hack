import { Controller, Post, Body, Delete, Request } from '@nestjs/common';

import { CheckSignature } from 'src/guards/guards';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @CheckSignature()
  async create(
    @Request() req,
    @Body() createApplicationnDto: CreateApplicationDto,
  ) {
    await this.applicationService.create({
      ...createApplicationnDto,
      userAddress: req.user,
    });
  }

  @Delete()
  async deleteMany(@Body() applicationIds: string[]) {
    await this.applicationService.deleteMany(applicationIds);
  }
}
