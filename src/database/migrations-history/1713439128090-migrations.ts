import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713439128090 implements MigrationInterface {
  name = 'Migrations1713439128090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_e5ab477456567d604dffaee55e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_e5ab477456567d604dffaee55e3" FOREIGN KEY ("replyToId") REFERENCES "commentes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_e5ab477456567d604dffaee55e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_e5ab477456567d604dffaee55e3" FOREIGN KEY ("replyToId") REFERENCES "commentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
