import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { LectureRepository } from 'src/routes/lectures/infastructure/persistence/lecture.repository';
import { RoleEnum } from 'src/routes/roles/roles.enum';
import { UserRepository } from 'src/routes/users/infrastructure/persistence/user.repository';
import { PathToLectureId } from 'src/shared/decorators/PathToLectureId.decorator';
@Injectable()
export class LectureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly lectureRepository: LectureRepository,
    private readonly usersRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pathToLectureId = this.reflector.get(
      PathToLectureId,
      context.getHandler(),
    );
    let lectureId = request;
    for (const path of pathToLectureId) {
      lectureId = lectureId[path];
    }
    const userFromReq: JwtPayloadType = request.user;
    if (!lectureId) {
      throw new BadRequestException('Lecture not found');
    }
    const [courseId, user] = await Promise.all([
      this.lectureRepository.getLectureCourseId(lectureId),
      this.usersRepository.findOne({ id: userFromReq.id }, ['courses']),
    ]);
    if (
      user.courses.some((e) => e.id === courseId) ||
      user.role?.id === RoleEnum.admin
    ) {
      return true;
    } else {
      return false;
    }
  }
}
