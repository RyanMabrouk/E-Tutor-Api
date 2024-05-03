import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714751882714 implements MigrationInterface {
  name = 'Migrations1714751882714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "name" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "color" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "expiryDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "value" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "numberOfUses" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "numberOfUses"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "expiryDate"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "color" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "name" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
  }
}
