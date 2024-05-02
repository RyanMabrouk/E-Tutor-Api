import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714634607278 implements MigrationInterface {
  name = 'Migrations1714634607278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purshases" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "discount" integer, "totalPrice" integer NOT NULL, "coursesId" integer, "userId" integer, CONSTRAINT "PK_5e9e5b2ea9b42301c15f744ab56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" ADD CONSTRAINT "FK_00a8cb5c6bd1f078072e63f6efa" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" ADD CONSTRAINT "FK_2904f7f8cd5d7c382b2d1861918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purshases" DROP CONSTRAINT "FK_2904f7f8cd5d7c382b2d1861918"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" DROP CONSTRAINT "FK_00a8cb5c6bd1f078072e63f6efa"`,
    );
    await queryRunner.query(`DROP TABLE "purshases"`);
  }
}
