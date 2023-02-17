import { Controller, Post, Body, Delete } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationnDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(@Body() createApplicationnDto: CreateApplicationnDto) {
    await this.applicationService.create(createApplicationnDto);
  }

  @Delete()
  async deleteMany(@Body() applicationIds: string[]) {
    await this.applicationService.deleteMany(applicationIds);
  }
}
