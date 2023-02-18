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

import { CheckCollectionOwner, CheckSignature } from 'src/guards/guards';
import { UserService } from 'src/user/user.service';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(
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

  @Get('tokenDbId')
  @CheckSignature()
  async findByUserAddress(@Request() { address }, @Param() tokenDbId: string) {
    let user = await this.userService.findOne({ address });
    if (!user) user = await this.userService.create({ address });
    if (tokenDbId) {
      return this.applicationService.findOne({
        user: user._id,
        desiredTokenMetadata: tokenDbId,
      });
    }
    return this.applicationService.find({ user: user._id });
  }

  @Patch()
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
    @Request() req,
    @Body()
    { accepted, declined }: { accepted: string[]; declined: string[] },
  ) {
    await this.applicationService.updateMany(
      { _id: accepted },
      { isAccepted: true },
    );
    await this.applicationService.updateMany(
      { _id: declined },
      { isAccepted: false },
    );
  }
}
