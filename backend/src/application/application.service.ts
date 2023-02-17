import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { checkMetadataOrThrow } from 'src/constants';
import { MetadataService } from 'src/metadata/metadata.service';
import {
  Application,
  ApplicationDocument,
} from 'src/schemas/application.schema';
import { CreateApplicationnDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel('Application')
    private applicationModel: Model<ApplicationDocument>,
    private readonly metadataService: MetadataService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationnDto,
  ): Promise<ApplicationDocument> {
    const { tokenId, ...applicationData } = createApplicationDto;
    const tokenMetadata = await this.metadataService.findOne({ tokenId });
    checkMetadataOrThrow(tokenMetadata, tokenId);
    const application = new this.applicationModel({
      desiredTokenMetadata: tokenMetadata._id,
      ...applicationData,
    });
    await application.save();
    await this.metadataService.updateById(tokenMetadata._id, {}, [
      application.id,
    ]);

    return application;
  }

  async deleteMany(applicationIds: string[]) {
    await this.applicationModel.deleteMany({ _id: applicationIds });
  }
}
