import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { SignatureGuard } from 'src/signature/signature.guard';
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Post()
  @UseGuards(SignatureGuard)
  async create(@Body() createMetadataDto: CreateMetadataDto) {
    await this.metadataService.create(createMetadataDto);
  }

  @Get()
  async findAll(): Promise<Metadata[]> {
    return this.metadataService.findAll();
  }
}
