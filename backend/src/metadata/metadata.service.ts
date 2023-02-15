import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Metadata, MetadataDocument } from '../schemas/metadata.schema';
import { CreateMetadataDto } from './create-metadata.dto';

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
    return this.metadataModel.find().exec();
  }
}
