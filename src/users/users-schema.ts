import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UserInputDTO } from './types';
import { v4 } from 'uuid';
import add from 'date-fns/add';

@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ default: false })
  isConfirmed: boolean;

  @Prop({ required: true })
  expirationDate: string;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true, type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;

  static createUser(DTO: UserInputDTO, UserModel: UserModelType): UserDocument {
    const user = new UserModel({
      login: DTO.login,
      email: DTO.email,
      createdAt: new Date().toISOString(),
      passwordHash: DTO.password,
      emailConfirmation: {
        confirmationCode: v4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
      },
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
