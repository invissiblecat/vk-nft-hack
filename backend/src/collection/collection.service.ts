import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection, CollectionDocument } from 'src/schemas/collection.schema';
import { Metadata } from 'src/schemas/metadata.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel('Collection')
    private collectionModel: Model<CollectionDocument>,
  ) {}

  async create(
    createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionDocument> {
    const createdMetadata = new this.collectionModel(createCollectionDto);
    return createdMetadata.save();
  }

  async findAll(): Promise<CollectionDocument[]> {
    return this.collectionModel.find().populate('tokensMetadata');
  }

  async findById(id: string): Promise<CollectionDocument> {
    return this.collectionModel.findById(id);
  }

  async findOne(filter: FilterQuery<Collection>): Promise<CollectionDocument> {
    return this.collectionModel.findOne(filter);
  }

  async addTokenMetadata(id: string, metadataId: string) {
    return this.collectionModel.findByIdAndUpdate(
      id,
      {
        $push: { tokensMetadata: metadataId },
      },
      { new: true },
    );
  }
}
