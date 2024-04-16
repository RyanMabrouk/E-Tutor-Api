import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713260117568 implements MigrationInterface {
  name = 'Migrations1713260117568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c"`,
    );
    await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "name" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c"`,
    );
    await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id")`,
    );
  }
}
