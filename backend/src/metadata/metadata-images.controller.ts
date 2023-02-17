import {
  Body,
  Controller,
  Get,
  NotFoundException,
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

const Jimp = require('jimp');
const CryptoJS = require('crypto-js');
import { create } from 'ipfs-core';

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

  @Post('ipfsUpload')
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
  async ipfsUpload(@Body() body: MetadataImageDto, @UploadedFile('file') file) {
    const ipfs = create();
    const ctstr = this.encrypt(file.buffer);
    const r = await ipfs.add(ctstr);
    console.log({ r });
  }

  @Get('ipfsDownload')
  async ipfsDownload(@Query('hash') hash: string) {
    const ipfs = await create();
    let file;
    const f = ipfs.get(hash);
    console.log({ f });
  }

  encrypt(argument: Buffer) {
    const key = 'ENCRYPT_KEY'; //todo to env
    const ct = CryptoJS.AES.encrypt(argument.toString('hex'), key);
    const ctstr = ct.toString();
    return Buffer.from(ctstr);
  }

  decrypt(encrypted: Uint8Array) {
    const key = 'ENCRYPT_KEY'; //todo to env
    var str = new TextDecoder('utf-8').decode(encrypted);
    console.log({ str });
    const decrypted = CryptoJS.AES.decrypt(str, key);
    console.log({ decrypted });
    str = CryptoJS.enc.Utf8.stringify(decrypted);
    console.log({ str });
    const wordArray = CryptoJS.enc.Hex.parse(str);
    const BaText = this.wordToByteArray(wordArray, wordArray.words.length);
    return BaText;
  }

  wordToByteArray(word, length) {
    var ba = [],
      i,
      xFF = 0xff;
    if (length > 0) ba.push(word >>> 24);
    if (length > 1) ba.push((word >>> 16) & xFF);
    if (length > 2) ba.push((word >>> 8) & xFF);
    if (length > 3) ba.push(word & xFF);
    return ba;
  }

  toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  }
}
