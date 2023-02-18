import mongoose, { FilterQuery, Model, ProjectionType, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { UpdateMetadataDto } from './dto/update-metadata.dto';
import { DEAFULT_IMAGES_PATH, DEFAULT_METADATA_EXCLUDE } from 'src/constants';
import { ContractsService } from 'src/contracts/contracts.service';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel('Metadata') private metadataModel: Model<MetadataDocument>,
    private contractsService: ContractsService,
  ) {}

  async create(createMetadataDto: Metadata): Promise<MetadataDocument> {
    const createdMetadata = new this.metadataModel(createMetadataDto);
    return createdMetadata.save();
  }

  async findAll(): Promise<MetadataDocument[]> {
    return this.metadataModel
      .find()
      .select(DEFAULT_METADATA_EXCLUDE)
      .populate('nftCollection')
      .populate('applications');
  }

  async findById(id: string, select?: Array<any>): Promise<MetadataDocument> {
    return this.metadataModel
      .findById(id)
      .populate('nftCollection', undefined, 'Collection')
      .populate('applications');
  }

  async findOne(
    filter: FilterQuery<Metadata>,
    select?: Array<any>,
  ): Promise<MetadataDocument> {
    return this.metadataModel
      .findOne(filter)
      .select(select)
      .populate('nftCollection')
      .populate('applications');
  }

  async findMany(
    filter: FilterQuery<Metadata>,
    select?: Array<any>,
  ): Promise<MetadataDocument[]> {
    return this.metadataModel
      .find(filter)
      .select(select)
      .populate('nftCollection')
      .populate('applications');
  }

  async updateById(
    id: Types.ObjectId,
    data: UpdateMetadataDto,
    applicationIds: string[] = [],
  ): Promise<MetadataDocument> {
    if (applicationIds.length) {
      await this.metadataModel.findByIdAndUpdate(id, {
        $push: { applications: [applicationIds] },
      });
    }
    return this.metadataModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('nftCollection')
      .populate('applications');
  }

  async findMetadataWithAccesses(user: string) {
    const metadatas = await this.findAll();
    const promises = metadatas.map((metadata) => {
      return this.contractsService.hasAccessToToken(
        user,
        metadata.nftCollection.collectionAddress,
        metadata.tokenId,
      );
    });
    const accesses = await Promise.all(promises);
    return { metadatas, accesses };
  }

  makeFileName(
    tokenId: string,
    collectionAddress: string,
    base64String: string,
  ) {
    let fileType = base64String.substring(
      base64String.indexOf('/') + 1,
      base64String.indexOf(';base64'),
    );
    if (fileType === 'svg+xml') {
      fileType = 'svg';
    }
    return tokenId + '-' + collectionAddress + '.' + fileType;
  }

  makeFilePath(
    tokenId: string,
    collectionAddress: string,
    base64String: string,
  ) {
    return (
      DEAFULT_IMAGES_PATH +
      '/' +
      this.makeFileName(tokenId, collectionAddress, base64String)
    );
  }

  makePreviewPath(
    tokenId: string,
    collectionAddress: string,
    base64String: string,
  ) {
    return (
      DEAFULT_IMAGES_PATH +
      '/' +
      'preview-' +
      this.makeFileName(tokenId, collectionAddress, base64String)
    );
  }

  getBase64Buffer = (base64String: string) => {
    const dataString = base64String.slice(base64String.indexOf(',') + 1);

    return Buffer.from(dataString, 'base64');
  };
}
