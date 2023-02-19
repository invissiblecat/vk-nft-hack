import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Patch,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { CheckCollectionOwner, CheckSignature } from 'src/guards/guards';
import { MetadataService } from 'src/metadata/metadata.service';
import { Application } from 'src/schemas/application.schema';
import { UserService } from 'src/user/user.service';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly applicationService: ApplicationService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @CheckSignature()
  async create(
    @Request() req,
    @Body() createApplicationnDto: CreateApplicationDto,
  ) {
    await this.applicationService.create({
      ...createApplicationnDto,
      address: req.user,
    });
  }

  @Get(':tokenDbId/all')
  @CheckSignature()
  async findAll(@Param('tokenDbId') tokenDbId: string) {
    return this.applicationService.find({
      desiredTokenMetadata: new Types.ObjectId(tokenDbId),
    });
  }

  @Get('metadata/availible')
  @CheckSignature()
  async findAccepted(@Request() req) {
    let user = await this.userService.findOne({ address: req.user });
    if (!user) user = await this.userService.create({ address: req.user });
    const applications = await this.applicationService.find({
      isAccepted: true,
      user: user._id,
    });
    let promises = [];
    applications.forEach((application) =>
      promises.push(
        this.metadataService.findOne({ _id: application.desiredTokenMetadata }),
      ),
    );
    return Promise.all(promises);
  }

  @Get(':tokenDbId')
  @CheckSignature()
  async findByUserAddress(
    @Request() req,
    @Param('tokenDbId') tokenDbId: string,
  ): Promise<Application> {
    let user = await this.userService.findOne({ address: req.user });
    if (!user) user = await this.userService.create({ address: req.user });
    console.log({ user });

    if (tokenDbId) {
      return this.applicationService.findOne({
        user: user._id,
        desiredTokenMetadata: new Types.ObjectId(tokenDbId),
      });
    }
    return this.applicationService.findOne({ user: user._id });
  }

  @Patch(':tokenDbId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collectionAddress: {
          type: 'string',
        },
        accepted: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        declined: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  @CheckCollectionOwner()
  async updateMany(
    @Param('tokenDbId') tokenDbId: string,
    @Body()
    { accepted, declined }: { accepted: string[]; declined: string[] },
  ) {
    await this.applicationService.updateMany(
      { _id: accepted, desiredTokenMetadata: new Types.ObjectId(tokenDbId) },
      { isAccepted: true },
    );
    await this.applicationService.updateMany(
      { _id: declined, desiredTokenMetadata: new Types.ObjectId(tokenDbId) },
      { isAccepted: false },
    );
  }
}
