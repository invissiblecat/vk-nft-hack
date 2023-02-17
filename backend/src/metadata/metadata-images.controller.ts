import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
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
import { CheckSignature } from 'src/guards/guards';
import { ContractsService } from 'src/contracts/contracts.service';
const Jimp = require('jimp');

@Controller('metadata-images')
export class MetadataImagesController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly contractsService: ContractsService,
  ) {
    if (!existsSync(DEAFULT_IMAGES_PATH)) {
      mkdirSync(DEAFULT_IMAGES_PATH);
    }
  }

  @Post('uploadImage')
  @CheckSignature()
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
  async uploadFile(
    @Request() req,
    @Body() body: MetadataImageDto,
    @UploadedFile('file') file,
  ) {
    const tokenMetadata = await this.metadataService.findOne({
      tokenId: body.tokenId,
    });
    checkMetadataOrThrow(tokenMetadata, body.tokenId);

    const isOwner = await this.contractsService.isCollectionOwner(req.user, {
      collectionAddress: tokenMetadata.nftCollection.collectionAddress,
    });
    if (!isOwner) {
      throw new ForbiddenException('access denied');
    }

    if (tokenMetadata.pathToImage) {
      unlinkSync(tokenMetadata.pathToImage);
      unlinkSync(tokenMetadata.pathToPreview);
    }

    const filePath = this.metadataService.makeFilePath(
      body.tokenId,
      file.originalname,
    );

    writeFileSync(filePath, file.buffer);

    const previewPath = this.metadataService.makePreviewPath(
      body.tokenId,
      file.originalname,
    );

    const original = await Jimp.read(filePath);
    original.blur(30).write(previewPath);

    await this.metadataService.updateById(tokenMetadata._id, {
      pathToImage: filePath,
      pathToPreview: previewPath,
    });
  }

  @Get('downloadOriginalImage')
  async downloadFile(
    @Query('tokenId') tokenId: string,
    @Res() response: Response,
  ) {
    const tokenMetadata = await this.metadataService.findOne({ tokenId });
    checkMetadataOrThrow(tokenMetadata, tokenId);

    const resolvedPath = resolve(tokenMetadata.pathToImage);
    if (!existsSync(resolvedPath)) {
      throw new NotFoundException(`Image for token ${tokenId} not found`);
    }

    response.download(resolvedPath);
    return response;
  }

  @Get('downloadPreview')
  async downloadPreview(
    @Query('tokenId') tokenId: string,
    @Res() response: Response,
  ) {
    const tokenMetadata = await this.metadataService.findOne({ tokenId });
    checkMetadataOrThrow(tokenMetadata, tokenId);

    const resolvedPath = resolve(tokenMetadata.pathToPreview);
    if (!existsSync(resolvedPath)) {
      throw new NotFoundException(`Preview for token ${tokenId} not found`);
    }

    response.download(resolvedPath);
    return response;
  }
}
