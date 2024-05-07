import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713866855077 implements MigrationInterface {
  name = 'Migrations1713866855077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_a09de3e6027500ac44609a8055f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "name" text`);
    let i = 0;
    const categories = await queryRunner.query(
      `SELECT * FROM "categories" WHERE "name" IS NULL`,
    );
    for (const category of categories) {
      await queryRunner.query(
        `UPDATE "categories" SET "name" = 'default${i}' WHERE "id" = ${category.id}`,
      );
      i++;
    }
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "color" text`);
    await queryRunner.query(
      `UPDATE "categories" SET "color" = 'default' WHERE "color" is NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories"  ALTER COLUMN "color" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_a09de3e6027500ac44609a8055f" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_a09de3e6027500ac44609a8055f"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "color" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_a09de3e6027500ac44609a8055f" FOREIGN KEY ("languageId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
