import { FilterQuery, Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { UpdateMetadataDto } from './dto/update-metadata.dto';

export const DEAFULT_IMAGES_PATH = 'images';

export const checkMetadataOrThrow = (
  tokenMetadata: Metadata | undefined,
  tokenId: string,
) => {
  if (!tokenMetadata) {
    throw new NotFoundException(
      `Metadata for token with id ${tokenId} not found`,
    );
  }
};
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
      .populate('nftCollection')
      .populate('applications');
  }

  async findById(id: string): Promise<MetadataDocument> {
    return this.metadataModel
      .findById(id)
      .populate('nftCollection')
      .populate('applications');
  }

  async findOne(filter: FilterQuery<Metadata>): Promise<MetadataDocument> {
    return this.metadataModel
      .findOne(filter)
      .populate('nftCollection')
      .populate('applications');
  }

  async updateById(
    id: Types.ObjectId,
    data: UpdateMetadataDto,
    applicationIds: string[] = [],
  ): Promise<MetadataDocument> {
    return this.metadataModel
      .findByIdAndUpdate(
        id,
        { $set: data, $push: { applications: [applicationIds] } },
        { new: true },
      )
      .populate('nftCollection');
  }

  makeFileName(tokenId: string, originalName: string) {
    return tokenId + '-' + originalName;
  }

  makeFilePath(tokenId: string, originalName: string) {
    return DEAFULT_IMAGES_PATH + '/' + this.makeFileName(tokenId, originalName);
  }

  makePreviewPath(tokenId: string, originalName: string) {
    return (
      DEAFULT_IMAGES_PATH +
      '/' +
      'preview-' +
      this.makeFileName(tokenId, originalName)
    );
  }
}
