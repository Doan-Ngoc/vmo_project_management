import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1744347547019 implements MigrationInterface {
    name = ' $npmConfigName1744347547019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "startedFrom" date NOT NULL, "dueDate" date NOT NULL, "status" "public"."project_status_enum" NOT NULL DEFAULT 'active', "pm_number" integer, "dev_number" integer, "working_unit_id" uuid, "client_id" uuid, "created_by" uuid, CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_member" ("project_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_0d739aa2794632a5a09276afb7a" PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aaef76230abfcdf30adb15d0be" ON "project_member" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5aa3e0aec43d3459e159d21dd" ON "project_member" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_3d3a5878ae3461d7a099d893340" FOREIGN KEY ("working_unit_id") REFERENCES "working_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c72d76e480d7334858782543610" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_1778afd0b8f381a6aa80b444519" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_aaef76230abfcdf30adb15d0be8" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_c5aa3e0aec43d3459e159d21dd3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_c5aa3e0aec43d3459e159d21dd3"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_aaef76230abfcdf30adb15d0be8"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_1778afd0b8f381a6aa80b444519"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c72d76e480d7334858782543610"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_3d3a5878ae3461d7a099d893340"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5aa3e0aec43d3459e159d21dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aaef76230abfcdf30adb15d0be"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
    }

}
