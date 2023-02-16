import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  checkMetadataOrThrow,
  DEAFULT_IMAGES_PATH,
  MetadataService,
} from './metadata.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MetadataImageDto } from './dto/upload-image-dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Response } from 'express';

@Controller('metadata-images')
export class MetadataImagesController {
  constructor(private readonly metadataService: MetadataService) {
    if (!existsSync(DEAFULT_IMAGES_PATH)) {
      mkdirSync(DEAFULT_IMAGES_PATH);
    }
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
  async uploadFile(@Body() body: MetadataImageDto, @UploadedFile('file') file) {
    const tokenMetadata = await this.metadataService.findOne({
      tokenId: body.tokenId,
    });
    checkMetadataOrThrow(tokenMetadata, body.tokenId);

    if (tokenMetadata.pathToImage) {
      unlinkSync(tokenMetadata.pathToImage);
    }

    const filePath = this.metadataService.makeFilePath(
      body.tokenId,
      file.originalname,
    );

    writeFileSync(filePath, file.buffer);

    await this.metadataService.updateById(tokenMetadata._id, {
      pathToImage: filePath,
    });
  }

  @Get('downloadImage')
  async downloadFile(
    @Query('tokenId') tokenId: string,
    @Res() response: Response,
  ) {
    const tokenMetadata = await this.metadataService.findOne({ tokenId });
    checkMetadataOrThrow(tokenMetadata, tokenId);

    const resolvedPath = resolve(tokenMetadata.pathToImage); //todo why not save already resolved in db
    if (!existsSync(resolvedPath)) {
      throw new NotFoundException(`Image for token ${tokenId} not found`);
    }

    response.download(resolvedPath);
    return response;
  }
}
