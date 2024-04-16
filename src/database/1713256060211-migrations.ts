import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1713256060211 implements MigrationInterface {
    name = 'Migrations1713256060211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcategories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_d1a3a67c9c5d440edf414af1271" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "color" character varying NOT NULL, CONSTRAINT "PK_8b0be371d28245da6e4f4b61878" PRIMARY KEY ("name"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bigoraphie" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "persenalWebsite" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twitter" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facebook" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instagram" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "whatsapp" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "youtube" character varying NOT NULL`);
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
