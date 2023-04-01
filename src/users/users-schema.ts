import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UserInputDTO } from './types';

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop()
  passwordHash: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  createdAt: string;

  static createUser(DTO: UserInputDTO, UserModel: UserModelType): UserDocument {
    const user = new UserModel({
      login: DTO.login,
      email: DTO.email,
      createdAt: new Date().toISOString(),
    });
    return user;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

const userStaticMethods: UserModelStaticType = {
  createUser: User.createUser,
};
UserSchema.statics = userStaticMethods;

export type UserDocument = HydratedDocument<User>;
export type UserModelStaticType = {
  createUser: (DTO: UserInputDTO, UserModel: UserModelType) => UserDocument;
};
export type UserModelType = Model<UserDocument> & UserModelStaticType;
