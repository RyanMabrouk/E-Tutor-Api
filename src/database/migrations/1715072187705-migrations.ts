import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1715072187705 implements MigrationInterface {
  name = 'Migrations1715072187705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "color" text NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subcategories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "categoryId" integer, CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."courses_level_enum" AS ENUM('All', 'Beginner', 'Intermediate', 'Expert')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."courses_status_enum" AS ENUM('draft', 'toBeReviewed', 'published', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" text NOT NULL, "subtitle" text NOT NULL, "topic" text NOT NULL, "level" "public"."courses_level_enum" NOT NULL DEFAULT 'All', "duration" integer NOT NULL, "description" text, "subjects" text array, "audience" text array, "requirements" text array, "welcomeMessage" text, "congratsMessage" text, "price" integer NOT NULL DEFAULT '0', "discount" integer NOT NULL DEFAULT '0', "status" "public"."courses_status_enum" NOT NULL DEFAULT 'draft', "categoryId" integer, "subcategoryId" integer, "languageId" integer, "thumbnailId" uuid, "trailerId" uuid, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" text, "firstName" text, "lastName" text, "username" text, "learningGoal" integer, "title" text, "bigoraphie" text, "persenalWebsite" text, "linkedin" text, "twitter" text, "facebook" text, "instagram" text, "whatsapp" text, "youtube" text, "photoId" uuid, "roleId" integer, "statusId" integer, "wishlistId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9583a1a42eebde5b1c16ee166d" UNIQUE ("wishlistId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "wishlists" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_4f3c30555daa6ab0b70a1db772" UNIQUE ("userId"), CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "hash" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" text NOT NULL, "rating" integer NOT NULL, "courseId" integer, "userId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purshases" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "discount" integer, "totalPrice" integer NOT NULL, "expiryDate" TIMESTAMP, "paymentIntentId" character varying NOT NULL, "couponCode" character varying, "coursesId" integer, "userId" integer, CONSTRAINT "PK_5e9e5b2ea9b42301c15f744ab56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "courseId" integer, CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lectures" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" text NOT NULL, "captions" text array NOT NULL, "descripstion" text NOT NULL, "sectionId" integer, "videoId" uuid, "attachementId" uuid, CONSTRAINT "PK_0fbf04287eb4e401af19caf7677" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "progress" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "completed" boolean NOT NULL DEFAULT false, "userId" integer, "lectureId" integer, CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" text NOT NULL, "seen" boolean NOT NULL DEFAULT false, "senderId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refunds" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "intentPaymentId" text NOT NULL, "reason" text, CONSTRAINT "PK_5106efb01eeda7e49a78b869738" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Chat" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_d9fa791e91c30baf21d778d3f2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."message_type_enum" AS ENUM('text', 'image', 'file', 'video', 'audio')`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" text NOT NULL, "type" "public"."message_type_enum" NOT NULL, "seen" boolean NOT NULL DEFAULT false, "senderId" integer, "chatId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coupons" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "expiryDate" TIMESTAMP NOT NULL, "value" integer NOT NULL, "numberOfUses" integer DEFAULT '0', "code" character varying NOT NULL, CONSTRAINT "PK_def022024d78bf1253518136f93" PRIMARY KEY ("id", "code"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e025109230e82925843f2a14c4" ON "coupons" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "commentes" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" text NOT NULL, "replyToId" integer, "userId" integer, "lectureId" integer, CONSTRAINT "PK_b773e8f35a9f21acfd732b3c952" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "courses_wishlists_wishlists" ("coursesId" integer NOT NULL, "wishlistsId" integer NOT NULL, CONSTRAINT "PK_1487948217744f386bfc6704891" PRIMARY KEY ("coursesId", "wishlistsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12d287767255d94f444bbe0de9" ON "courses_wishlists_wishlists" ("coursesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e81a91d3e1d876e6182e64ed3f" ON "courses_wishlists_wishlists" ("wishlistsId") `,
    );
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
      `CREATE TABLE "wishlists_courses_courses" ("wishlistsId" integer NOT NULL, "coursesId" integer NOT NULL, CONSTRAINT "PK_39716def8026fe110b04111866e" PRIMARY KEY ("wishlistsId", "coursesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1661cdea409b0ef4c64b66af8e" ON "wishlists_courses_courses" ("wishlistsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_116e8655d30604cf773f8d61e9" ON "wishlists_courses_courses" ("coursesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_receivers_user" ("notificationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_dae974f2263439724e1b37747c5" PRIMARY KEY ("notificationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca091cd6fcfc7b55d83cf306bf" ON "notification_receivers_user" ("notificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7dfd3dd996e06fe47828d1c93d" ON "notification_receivers_user" ("userId") `,
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
      `ALTER TABLE "subcategories" ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_c730473dfb837b3e62057cd9447" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_2558d26ff2511ae6b405a012284" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_a09de3e6027500ac44609a8055f" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_28dcb6eab95ecd3598c4220cfef" FOREIGN KEY ("thumbnailId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_f63b8b3e2461ea7843e428e846d" FOREIGN KEY ("trailerId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9583a1a42eebde5b1c16ee166d2" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_01ad76b89c3d4f612209556e2c3" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" ADD CONSTRAINT "FK_00a8cb5c6bd1f078072e63f6efa" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" ADD CONSTRAINT "FK_2904f7f8cd5d7c382b2d1861918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_a325ec7787dfb43659fb71e1ec9" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_e5ab477456567d604dffaee55e3" FOREIGN KEY ("replyToId") REFERENCES "commentes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_3205a829e4bacb0f037bcca9f3c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" ADD CONSTRAINT "FK_86651517520d8bd825b8ab7c606" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "courses_wishlists_wishlists" ADD CONSTRAINT "FK_12d287767255d94f444bbe0de99" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_wishlists_wishlists" ADD CONSTRAINT "FK_e81a91d3e1d876e6182e64ed3f3" FOREIGN KEY ("wishlistsId") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" ADD CONSTRAINT "FK_e01f6486bfed8aceb2c061fd341" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" ADD CONSTRAINT "FK_e4ad7110b5c8d8767b6f7906be6" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists_courses_courses" ADD CONSTRAINT "FK_1661cdea409b0ef4c64b66af8e1" FOREIGN KEY ("wishlistsId") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists_courses_courses" ADD CONSTRAINT "FK_116e8655d30604cf773f8d61e9e" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" ADD CONSTRAINT "FK_ca091cd6fcfc7b55d83cf306bfc" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" ADD CONSTRAINT "FK_7dfd3dd996e06fe47828d1c93db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE "notification_receivers_user" DROP CONSTRAINT "FK_7dfd3dd996e06fe47828d1c93db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user" DROP CONSTRAINT "FK_ca091cd6fcfc7b55d83cf306bfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists_courses_courses" DROP CONSTRAINT "FK_116e8655d30604cf773f8d61e9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists_courses_courses" DROP CONSTRAINT "FK_1661cdea409b0ef4c64b66af8e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" DROP CONSTRAINT "FK_e4ad7110b5c8d8767b6f7906be6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_courses_courses" DROP CONSTRAINT "FK_e01f6486bfed8aceb2c061fd341"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_wishlists_wishlists" DROP CONSTRAINT "FK_e81a91d3e1d876e6182e64ed3f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses_wishlists_wishlists" DROP CONSTRAINT "FK_12d287767255d94f444bbe0de99"`,
    );
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
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_86651517520d8bd825b8ab7c606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_3205a829e4bacb0f037bcca9f3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commentes" DROP CONSTRAINT "FK_e5ab477456567d604dffaee55e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_a325ec7787dfb43659fb71e1ec9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_648faf30da0ff26761f865e3d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_f2e1e9db541097dd05e8e33bdd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lectures" DROP CONSTRAINT "FK_eabd11159a2602e1712593a38b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" DROP CONSTRAINT "FK_2904f7f8cd5d7c382b2d1861918"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purshases" DROP CONSTRAINT "FK_00a8cb5c6bd1f078072e63f6efa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_01ad76b89c3d4f612209556e2c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9583a1a42eebde5b1c16ee166d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
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
      `ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8c4e5bfdb28f12dc9a73dd3b5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd7edbaccbb127f22fecd29674"`,
    );
    await queryRunner.query(`DROP TABLE "chat_members_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7dfd3dd996e06fe47828d1c93d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca091cd6fcfc7b55d83cf306bf"`,
    );
    await queryRunner.query(`DROP TABLE "notification_receivers_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_116e8655d30604cf773f8d61e9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1661cdea409b0ef4c64b66af8e"`,
    );
    await queryRunner.query(`DROP TABLE "wishlists_courses_courses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4ad7110b5c8d8767b6f7906be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e01f6486bfed8aceb2c061fd34"`,
    );
    await queryRunner.query(`DROP TABLE "user_courses_courses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e81a91d3e1d876e6182e64ed3f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12d287767255d94f444bbe0de9"`,
    );
    await queryRunner.query(`DROP TABLE "courses_wishlists_wishlists"`);
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
    await queryRunner.query(`DROP TABLE "commentes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e025109230e82925843f2a14c4"`,
    );
    await queryRunner.query(`DROP TABLE "coupons"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
    await queryRunner.query(`DROP TABLE "Chat"`);
    await queryRunner.query(`DROP TABLE "refunds"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "progress"`);
    await queryRunner.query(`DROP TABLE "lectures"`);
    await queryRunner.query(`DROP TABLE "sections"`);
    await queryRunner.query(`DROP TABLE "purshases"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "wishlists"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."courses_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "subcategories"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
