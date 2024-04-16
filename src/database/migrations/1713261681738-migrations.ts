import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713261681738 implements MigrationInterface {
  name = 'Migrations1713261681738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "categoryId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP COLUMN "categoryId"`,
    );
  }
}
