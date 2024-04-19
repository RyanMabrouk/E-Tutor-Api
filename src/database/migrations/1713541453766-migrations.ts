import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713541453766 implements MigrationInterface {
  name = 'Migrations1713541453766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."courses_status_enum" AS ENUM('draft', 'toBeReviewed', 'published', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "status" "public"."courses_status_enum" NOT NULL DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "subjects" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "audience" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "requirements" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "welcomeMessage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "congratsMessage" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "congratsMessage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "welcomeMessage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "requirements" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "audience" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "subjects" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."courses_status_enum"`);
  }
}
