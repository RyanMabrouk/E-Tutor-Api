import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713884312155 implements MigrationInterface {
  name = 'Migrations1713884312155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "language" ADD "name" text`);
    await queryRunner.query(
      `UPDATE "language" SET "name" = '' WHERE "name" is NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "language"  ALTER COLUMN "name" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "language" ADD "name" character varying NOT NULL`,
    );
  }
}
