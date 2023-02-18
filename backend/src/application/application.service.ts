import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { checkMetadataOrThrow } from 'src/constants';
import { CheckSignature } from 'src/guards/guards';
import { MetadataService } from 'src/metadata/metadata.service';
import {
  Application,
  ApplicationDocument,
} from 'src/schemas/application.schema';
import { UserService } from 'src/user/user.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel('Application')
    private applicationModel: Model<ApplicationDocument>,
    private readonly metadataService: MetadataService,
    private readonly userService: UserService,
  ) {}

  async create({
    tokenDbId,
    address,
  }: CreateApplicationDto): Promise<ApplicationDocument> {
    const tokenMetadata = await this.metadataService.findById(tokenDbId);
    checkMetadataOrThrow(tokenMetadata, tokenDbId);

    let user = await this.userService.findOne({ address });
    if (!user) {
      user = await this.userService.create({
        address,
      });
    }

    let existingApplication = await this.findOne({
      desiredTokenMetadata: tokenMetadata._id,
      user: user._id,
    });
    if (existingApplication) return;

    const application = new this.applicationModel({
      desiredTokenMetadata: tokenMetadata._id,
      user: user._id,
    });
    await application.save();

    await this.metadataService.updateById(tokenMetadata._id, {}, [
      application.id,
    ]);

    await this.userService.updateById(user._id, [application.id]);

    return application;
  }

  async deleteMany(applicationIds: string[]) {
    await this.applicationModel.deleteMany({ _id: applicationIds });
  }

  async find(filter: FilterQuery<Application>): Promise<Application[]> {
    return this.applicationModel.find(filter).populate('user');
  }

  async findOne(filter: FilterQuery<Application>): Promise<Application> {
    return this.applicationModel.findOne(filter).populate('user');
  }

  async updateMany(
    filter: FilterQuery<Application>,
    data: Partial<Application>,
  ) {
    return this.applicationModel.updateMany(filter, data);
  }
}
