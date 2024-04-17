import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713343534466 implements MigrationInterface {
  name = 'Migrations1713343534466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."courses_level_enum" AS ENUM('All', 'Beginner', 'Intermediate', 'Expert')`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" text NOT NULL, "subtitle" text NOT NULL, "topic" text NOT NULL, "level" "public"."courses_level_enum" NOT NULL DEFAULT 'All', "duration" integer NOT NULL, "description" json NOT NULL, "subjects" text array NOT NULL, "audience" text array NOT NULL, "requirements" text array NOT NULL, "welcomeMessage" text NOT NULL, "congratsMessage" text NOT NULL, "price" integer NOT NULL DEFAULT '0', "discount" integer DEFAULT '0', "categoryId" integer, "subcategoryId" integer, "languageId" integer, "thumbnailId" uuid, "trailerId" uuid, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses_subtitle_language_language" ("coursesId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_b17805726aeaa92e9f95455898d" PRIMARY KEY ("coursesId", "languageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7346e133f75623a777a2ad0960" ON "courses_subtitle_language_language" ("coursesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_238c19d6a2a6e7a442b3551116" ON "courses_subtitle_language_language" ("languageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "courses_instructors_user" ("coursesId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_92b9ac98e16a703cc941e5d8125" PRIMARY KEY ("coursesId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d94df42ecd00effdc433d014c" ON "courses_instructors_user" ("coursesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d818025dbe973a8d4e4dcc3e3b" ON "courses_instructors_user" ("userId") `,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "socialId" text`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "firstName" text`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "lastName" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "username" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "title" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bigoraphie"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "bigoraphie" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "persenalWebsite"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "persenalWebsite" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedin"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "linkedin" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "twitter" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "facebook" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "instagram" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "whatsapp" text`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "youtube"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "youtube" text`);
    await queryRunner.query(
      `ALTER TABLE "language" DROP CONSTRAINT "UQ_7df7d1e250ea2a416f078a631fb"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_c730473dfb837b3e62057cd9447" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_2558d26ff2511ae6b405a012284" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_a09de3e6027500ac44609a8055f" FOREIGN KEY ("languageId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_28dcb6eab95ecd3598c4220cfef" FOREIGN KEY ("thumbnailId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_f63b8b3e2461ea7843e428e846d" FOREIGN KEY ("trailerId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_subtitle_language_language" ADD CONSTRAINT "FK_7346e133f75623a777a2ad09601" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_subtitle_language_language" ADD CONSTRAINT "FK_238c19d6a2a6e7a442b3551116a" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_instructors_user" ADD CONSTRAINT "FK_0d94df42ecd00effdc433d014c4" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_instructors_user" ADD CONSTRAINT "FK_d818025dbe973a8d4e4dcc3e3b2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses_instructors_user" DROP CONSTRAINT "FK_d818025dbe973a8d4e4dcc3e3b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_instructors_user" DROP CONSTRAINT "FK_0d94df42ecd00effdc433d014c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_subtitle_language_language" DROP CONSTRAINT "FK_238c19d6a2a6e7a442b3551116a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_subtitle_language_language" DROP CONSTRAINT "FK_7346e133f75623a777a2ad09601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_f63b8b3e2461ea7843e428e846d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_28dcb6eab95ecd3598c4220cfef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_a09de3e6027500ac44609a8055f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_2558d26ff2511ae6b405a012284"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_c730473dfb837b3e62057cd9447"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "language" ADD CONSTRAINT "UQ_7df7d1e250ea2a416f078a631fb" UNIQUE ("name")`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "youtube"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "youtube" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "whatsapp"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "whatsapp" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "instagram" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "facebook" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "twitter" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedin"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "linkedin" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "persenalWebsite"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "persenalWebsite" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bigoraphie"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "bigoraphie" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socialId" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d818025dbe973a8d4e4dcc3e3b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0d94df42ecd00effdc433d014c"`,
    );
    await queryRunner.query(`DROP TABLE "courses_instructors_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_238c19d6a2a6e7a442b3551116"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7346e133f75623a777a2ad0960"`,
    );
    await queryRunner.query(`DROP TABLE "courses_subtitle_language_language"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
  }
}
