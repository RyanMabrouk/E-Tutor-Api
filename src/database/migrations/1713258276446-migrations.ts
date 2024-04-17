import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713258276446 implements MigrationInterface {
  name = 'Migrations1713258276446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "username" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "username" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "title" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "title" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "title" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "bigoraphie" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "bigoraphie" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "bigoraphie" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "persenalWebsite" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "persenalWebsite" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "persenalWebsite" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "linkedin" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "linkedin" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "linkedin" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "twitter" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "twitter" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "twitter" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "facebook" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "facebook" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "facebook" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "instagram" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "instagram" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "instagram" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "whatsapp" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "whatsapp" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "whatsapp" SET NOT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "youtube" character varying;
    `);
    await queryRunner.query(`UPDATE "user" SET "youtube" = 'default';
    `);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "youtube" SET NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "youtube"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedin"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "persenalWebsite"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bigoraphie"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "subcategories"`);
  }
}
