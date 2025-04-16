import { MigrationInterface, QueryRunner } from "typeorm";

export class SmallChanges1744456135310 implements MigrationInterface {
    name = 'SmallChanges1744456135310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "isDeleted" TO "updated_by"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."projects_status_enum" RENAME TO "projects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('active', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."projects_status_enum" USING "status"::"text"::"public"."projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_5d927ef9f86fac1f1671d093a04" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d927ef9f86fac1f1671d093a04"`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum_old" AS ENUM('active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."projects_status_enum_old" USING "status"::"text"::"public"."projects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."projects_status_enum_old" RENAME TO "projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_by" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tasks" RENAME COLUMN "updated_by" TO "isDeleted"`);
    }

}
