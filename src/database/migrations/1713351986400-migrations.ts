import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713351986400 implements MigrationInterface {
  name = 'Migrations1713351986400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "courses" SET "discount" = 0;
    `);
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "discount" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "discount" DROP NOT NULL`,
    );
  }
}
