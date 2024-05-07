import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713876820874 implements MigrationInterface {
  name = 'Migrations1713876820874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_courses_courses" ("userId" integer NOT NULL, "coursesId" integer NOT NULL, CONSTRAINT "PK_86c942cab1d66e7878a5a005fd2" PRIMARY KEY ("userId", "coursesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e01f6486bfed8aceb2c061fd34" ON "user_courses_courses" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4ad7110b5c8d8767b6f7906be" ON "user_courses_courses" ("coursesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" ADD CONSTRAINT "FK_e01f6486bfed8aceb2c061fd341" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" ADD CONSTRAINT "FK_e4ad7110b5c8d8767b6f7906be6" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" DROP CONSTRAINT "FK_e4ad7110b5c8d8767b6f7906be6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" DROP CONSTRAINT "FK_e01f6486bfed8aceb2c061fd341"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4ad7110b5c8d8767b6f7906be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e01f6486bfed8aceb2c061fd34"`,
    );
    await queryRunner.query(`DROP TABLE "user_courses_courses"`);
  }
}
