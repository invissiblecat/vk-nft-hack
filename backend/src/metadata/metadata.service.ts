import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';

export const DEAFULT_IMAGES_PATH = 'images';

export const checkMetadataOrThrow = (
  //todo name
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

  async create(createMetadataDto: CreateMetadataDto): Promise<Metadata> {
    const createdMetadata = new this.metadataModel(createMetadataDto);
    return createdMetadata.save();
  }

  async findAll(): Promise<Metadata[]> {
    return this.metadataModel.find();
  }

  async findById(id: string): Promise<Metadata> {
    return this.metadataModel.findById(id);
  }

  async findOne(filter: FilterQuery<Metadata>): Promise<Metadata> {
    return this.metadataModel.findOne(filter);
  }

  async updateById(
    id: Types.ObjectId,
    data: UpdateMetadataDto,
  ): Promise<Metadata> {
    return this.metadataModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
  }

  makeFileName(tokenId: string, originalName: string) {
    return tokenId + '-' + originalName;
  }

  makeFilePath(tokenId: string, originalName: string) {
    return DEAFULT_IMAGES_PATH + '/' + this.makeFileName(tokenId, originalName);
  }
}
