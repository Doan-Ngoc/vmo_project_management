import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744118874575 implements MigrationInterface {
    name = ' $NAME1744118874575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "working_unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_0efc7f19513a1c09fcd1733c860" UNIQUE ("name"), CONSTRAINT "PK_45096e8151b2ba2fa32761433cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('ADMIN', 'REGULAR', 'LEADER', 'MEMBER')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."role_name_enum" NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "hashed_password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "employee_name" character varying(255) NOT NULL, "account_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_picture" text, "account_role_id" uuid, "working_unit_id" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c57754862d92d288007ce87b4af" FOREIGN KEY ("account_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6" FOREIGN KEY ("working_unit_id") REFERENCES "working_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c57754862d92d288007ce87b4af"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`DROP TABLE "working_unit"`);
    }

}
