import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../../routes/users/domain/user';
import { UsersService } from '../../routes/users/users.service';

@Injectable()
export class ValidateMembers {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async validate(members: User[]) {
    const userIds = members.map((e) => e.id);
    if (new Set(userIds).size !== userIds.length) {
      throw new BadRequestException('Members must be unique');
    }
    const usersPromises = members.map((e) =>
      this.usersService.findOne({
        id: e.id,
      }),
    );
    await Promise.all(usersPromises);
  }
}
