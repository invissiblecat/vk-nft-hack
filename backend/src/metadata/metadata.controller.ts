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
import { CreateMetadataDto } from './create-metadata.dto';
import { Metadata } from '../schemas/metadata.schema';
import { SignatureGuard } from 'src/signature/signature.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiProperty } from '@nestjs/swagger';
import { MetadataImageDto } from './upload-image-dto';
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

  @Post('uploadImage')
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
    console.log(existsSync(DEAFULT_IMAGES_PATH));
    if (!existsSync(DEAFULT_IMAGES_PATH)) {
      mkdirSync(DEAFULT_IMAGES_PATH);
    }

    writeFileSync(DEAFULT_IMAGES_PATH + '/' + file.originalname, file.buffer);
  }

  @Get('downloadImage')
  downloadFile(
    @Query('imageName') imageName: string,
    @Res() response: Response,
  ) {
    console.log({ imageName });

    const filePath = DEAFULT_IMAGES_PATH + '/' + imageName;
    const resolvedPath = resolve(filePath);
    console.log({ resolvedPath });
    if (!existsSync(resolvedPath)) {
      console.log(1);
    }
    response.download(resolvedPath);
    return response;
  }
}
