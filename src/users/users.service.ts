import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserInputDTO } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from './users-schema';
import { UsersRepository } from './repositories/users.repository';
import { AuthService } from '../auth/auth.service';
import bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected usersRepository: UsersRepository, //@Inject(forwardRef(() => AuthService)) //protected authService: AuthService,
    protected emailService: EmailService,
  ) {}

  async create(DTO: UserInputDTO): Promise<string> {
    //const passwordHash = await this.authService.generateHash(DTO.password);
    //todo --> DTO change?
    console.log('DTO --> ', DTO);

    DTO.password = await bcrypt.hash(DTO.password, 10);
    const user = this.UserModel.createUser(DTO, this.UserModel);
    await this.usersRepository.save(user);

    console.log('DTO --> ', DTO);

    await this.emailService.sendEmail(
      DTO.email,
      'subject',
      user.emailConfirmation.confirmationCode,
    );

    return user._id.toString();
  }

  async delete(userId: string) {
    await this.usersRepository.delete(userId);
  }

  async getByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    return this.usersRepository.getByLoginOrEmail(loginOrEmail);
  }

  async registrationEmailResend(email: string) {
    const user = await this.usersRepository.getByLoginOrEmail(email);
    if (!user) return null;

    //todo --> is this correct?
    user.emailConfirmation.confirmationCode = v4();
    await this.usersRepository.save(user);

    await this.emailService.sendEmail(
      email,
      'subject',
      user.emailConfirmation.confirmationCode,
    );
  }

  async confirm(code: string) {
    const user = await this.usersRepository.getByCode(code);
    console.log('code -->', code);
    console.log('user -->', user);
    if (!user) return null;

    user.emailConfirmation.isConfirmed = true;

    await this.usersRepository.save(user);
  }
}
