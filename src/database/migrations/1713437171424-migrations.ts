import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713437171424 implements MigrationInterface {
  name = 'Migrations1713437171424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "commentes" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" text NOT NULL, "replyToId" integer, "userId" integer, "lectureId" integer, CONSTRAINT "PK_b773e8f35a9f21acfd732b3c952" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_e5ab477456567d604dffaee55e3" FOREIGN KEY ("replyToId") REFERENCES "commentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_3205a829e4bacb0f037bcca9f3c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_86651517520d8bd825b8ab7c606" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_86651517520d8bd825b8ab7c606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_3205a829e4bacb0f037bcca9f3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_e5ab477456567d604dffaee55e3"`,
    );
    await queryRunner.query(`DROP TABLE "commentes"`);
  }
}
