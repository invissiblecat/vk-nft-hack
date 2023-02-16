import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { SignatureGuard } from 'src/signature/signature.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MetadataImageDto } from './upload-image-dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

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

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tokenId: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body: MetadataImageDto, @UploadedFile('file') file) {
    const path = './images';
    console.log(existsSync(path));
    if (!existsSync(path)) {
      mkdirSync(path);
    }

    writeFileSync(path + '/' + file.originalname, file.buffer);
  }
}
