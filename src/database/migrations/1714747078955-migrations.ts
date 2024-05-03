import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714747078955 implements MigrationInterface {
  name = 'Migrations1714747078955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "description" json`);
  }
}
