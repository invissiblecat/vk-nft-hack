import mongoose, { FilterQuery, Model, ProjectionType, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { UpdateMetadataDto } from './dto/update-metadata.dto';
import { DEAFULT_IMAGES_PATH, DEFAULT_METADATA_EXCLUDE } from 'src/constants';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel('Metadata') private metadataModel: Model<MetadataDocument>,
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

  async findById(id: string): Promise<MetadataDocument> {
    return this.metadataModel
      .findById(id)
      .populate('nftCollection')
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

  makeFileName(
    tokenId: string,
    collectionAddress: string,
    originalName: string,
  ) {
    return tokenId + '-' + collectionAddress + '-' + originalName;
  }

  makeFilePath(
    tokenId: string,
    collectionAddress: string,
    originalName: string,
  ) {
    return (
      DEAFULT_IMAGES_PATH +
      '/' +
      this.makeFileName(tokenId, collectionAddress, originalName)
    );
  }

  makePreviewPath(
    tokenId: string,
    collectionAddress: string,
    originalName: string,
  ) {
    return (
      DEAFULT_IMAGES_PATH +
      '/' +
      'preview-' +
      this.makeFileName(tokenId, collectionAddress, originalName)
    );
  }
}
