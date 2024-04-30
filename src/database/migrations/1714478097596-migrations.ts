import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714478097596 implements MigrationInterface {
  name = 'Migrations1714478097596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "progress" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "completed" boolean NOT NULL DEFAULT false, "userId" integer, "lectureId" integer, CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_a325ec7787dfb43659fb71e1ec9" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_a325ec7787dfb43659fb71e1ec9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`,
    );
    await queryRunner.query(`DROP TABLE "progress"`);
  }
}
