import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { SignatureGuard } from 'src/signature/signature.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiProperty } from '@nestjs/swagger';
import { MetadataImageDto } from './dto/upload-image-dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Response } from 'express';

const DEAFULT_IMAGES_PATH = './images';
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
