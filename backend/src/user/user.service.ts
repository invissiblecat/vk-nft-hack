import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findOne(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter);
  }

  async updateById(id: Types.ObjectId, applicationIds: string[] = []) {
    return this.userModel.findByIdAndUpdate(id, {
      $push: { applications: [applicationIds] },
    });
  }
}
