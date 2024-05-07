import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713360799821 implements MigrationInterface {
  name = 'Migrations1713360799821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sections" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "courseId" integer, CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d"`,
    );
    await queryRunner.query(`DROP TABLE "sections"`);
  }
}
