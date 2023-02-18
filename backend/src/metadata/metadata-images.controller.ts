import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MetadataImageDto } from './dto/upload-image-dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Response } from 'express';
import { CheckSignature } from 'src/guards/guards';
import { ContractsService } from 'src/contracts/contracts.service';
import {
  DEAFULT_IMAGES_PATH,
  checkMetadataOrThrow,
  getUserAddress,
} from 'src/constants';

const Jimp = require('jimp');

@Controller('images')
export class MetadataImagesController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly contractsService: ContractsService,
  ) {
    if (!existsSync(DEAFULT_IMAGES_PATH)) {
      mkdirSync(DEAFULT_IMAGES_PATH);
    }
  }

  @Post()
  @CheckSignature()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tokenId: {
          type: 'string',
        },
        collectionAddress: {
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
    console.log({ file });

    const tokenMetadatas = await this.metadataService.findMany({
      tokenId: body.tokenId,
    });
    const tokenMetadata = tokenMetadatas.find(
      (metadata) =>
        metadata.nftCollection.collectionAddress === body.collectionAddress,
    );
    checkMetadataOrThrow(tokenMetadata, body.tokenId);

    const isOwner = await this.contractsService.isCollectionOwner(req.user, {
      collectionAddress: tokenMetadata.nftCollection.collectionAddress,
    });
    if (!isOwner) {
      throw new ForbiddenException('access denied');
    }

    if (tokenMetadata.pathToImage) {
      unlinkSync(tokenMetadata.pathToImage); //todo exception
      unlinkSync(tokenMetadata.pathToPreview);
    }

    const filePath = this.metadataService.makeFilePath(
      body.tokenId,
      body.collectionAddress,
      file.originalname,
    );
    console.log({ filePath });

    writeFileSync(filePath, file.buffer);

    const previewPath = this.metadataService.makePreviewPath(
      body.tokenId,
      body.collectionAddress,
      file.originalname,
    );

    const original = await Jimp.read(filePath);
    original.blur(30).write(previewPath);

    await this.metadataService.updateById(tokenMetadata._id, {
      pathToImage: filePath,
      pathToPreview: previewPath,
    });
  }

  @Get(':tokenId')
  async downloadFile(
    @Param('tokenId') tokenId: string,
    @Query('collectionAddress') collectionAddress: string,
    @Query('signature') signature: string,
    @Res() response: Response,
  ) {
    const user = getUserAddress(signature);
    const tokenMetadatas = await this.metadataService.findMany({ tokenId });
    const tokenMetadata = tokenMetadatas.find(
      (metadata) =>
        metadata.nftCollection.collectionAddress === collectionAddress,
    );
    checkMetadataOrThrow(tokenMetadata, tokenId);
    const hasAccess = await this.contractsService.hasAccessToToken(
      user,
      collectionAddress,
      tokenId,
    );

    let path = tokenMetadata.pathToPreview;
    if (hasAccess) path = tokenMetadata.pathToImage;

    const resolvedPath = resolve(path);
    if (!existsSync(resolvedPath)) {
      throw new NotFoundException(`Image for token ${tokenId} not found`);
    }

    response.download(resolvedPath);
    return response;
  }
}
