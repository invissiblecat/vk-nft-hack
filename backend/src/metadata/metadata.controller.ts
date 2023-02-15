import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Post()
  async create(
    @Param('signature') signature: string,
    @Body() createMetadataDto: CreateMetadataDto,
  ) {
    await this.metadataService.create(createMetadataDto);
  }

  @Get()
  async findAll(): Promise<Metadata[]> {
    return this.metadataService.findAll();
  }
}
