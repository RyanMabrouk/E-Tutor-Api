import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1711962625254 implements MigrationInterface {
  name = 'Migrations1711962625254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "message" WHERE "chatId" = 385`);
    await queryRunner.query(`DELETE FROM "message" WHERE "chatId" = 73`);
    await queryRunner.query(`DELETE FROM "message" WHERE "chatId" = 989`);
    await queryRunner.query(`DELETE FROM "message" WHERE "chatId" = 58`);

    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`,
    );
    await queryRunner.query(
      `CREATE TABLE "Chat" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_d9fa791e91c30baf21d778d3f2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_members_user" ("chatId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_0659796185219b27cd0d7eadb48" PRIMARY KEY ("chatId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd7edbaccbb127f22fecd29674" ON "chat_members_user" ("chatId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8c4e5bfdb28f12dc9a73dd3b5" ON "chat_members_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_members_user" ADD CONSTRAINT "FK_cd7edbaccbb127f22fecd296743" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_members_user" ADD CONSTRAINT "FK_c8c4e5bfdb28f12dc9a73dd3b57" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_members_user" DROP CONSTRAINT "FK_c8c4e5bfdb28f12dc9a73dd3b57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_members_user" DROP CONSTRAINT "FK_cd7edbaccbb127f22fecd296743"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8c4e5bfdb28f12dc9a73dd3b5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd7edbaccbb127f22fecd29674"`,
    );
    await queryRunner.query(`DROP TABLE "chat_members_user"`);
    await queryRunner.query(`DROP TABLE "Chat"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
