import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/routes/roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from 'src/routes/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'Admin',
        }),
      );
    }

    const countInstructor = await this.repository.count({
      where: {
        id: RoleEnum.instructor,
      },
    });

    if (!countInstructor) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.instructor,
          name: 'Instructor',
        }),
      );
    }
  }
}
