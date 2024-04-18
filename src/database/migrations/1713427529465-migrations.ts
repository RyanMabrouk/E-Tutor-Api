import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713427529465 implements MigrationInterface {
  name = 'Migrations1713427529465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lectures" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "captions" text array NOT NULL, "descripstion" text NOT NULL, "sectionId" integer, "videoId" uuid, "attachementId" uuid, CONSTRAINT "PK_0fbf04287eb4e401af19caf7677" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" ADD CONSTRAINT "FK_eabd11159a2602e1712593a38b3" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" ADD CONSTRAINT "FK_f2e1e9db541097dd05e8e33bdd7" FOREIGN KEY ("videoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" ADD CONSTRAINT "FK_648faf30da0ff26761f865e3d23" FOREIGN KEY ("attachementId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_648faf30da0ff26761f865e3d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_f2e1e9db541097dd05e8e33bdd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_eabd11159a2602e1712593a38b3"`,
    );
    await queryRunner.query(`DROP TABLE "lectures"`);
  }
}
