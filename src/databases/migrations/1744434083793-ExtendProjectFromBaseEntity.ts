import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendProjectFromBaseEntity1744434083793 implements MigrationInterface {
    name = 'ExtendProjectFromBaseEntity1744434083793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_1778afd0b8f381a6aa80b444519"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_3d3a5878ae3461d7a099d893340"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_c72d76e480d7334858782543610"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum" RENAME TO "role_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('dev', 'pm')`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE "public"."roles_name_enum" USING "name"::"text"::"public"."roles_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."project_status_enum" RENAME TO "project_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."projects_status_enum" USING "status"::"text"::"public"."projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."user_account_type_enum" RENAME TO "user_account_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_account_type_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_type" TYPE "public"."users_account_type_enum" USING "account_type"::"text"::"public"."users_account_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."user_account_status_enum" RENAME TO "user_account_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_account_status_enum" AS ENUM('pending', 'active', 'disable')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" TYPE "public"."users_account_status_enum" USING "account_status"::"text"::"public"."users_account_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fef264045adf59bb4c260d2352d" FOREIGN KEY ("working_unit_id") REFERENCES "working_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_ca29f959102228649e714827478" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4aa2296d359a512862462cb9608" FOREIGN KEY ("working_unit_id") REFERENCES "working_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4aa2296d359a512862462cb9608"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_ca29f959102228649e714827478"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fef264045adf59bb4c260d2352d"`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_status_enum_old" AS ENUM('pending', 'active', 'disable')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" TYPE "public"."user_account_status_enum_old" USING "account_status"::"text"::"public"."user_account_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_account_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_account_status_enum_old" RENAME TO "user_account_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_type_enum_old" AS ENUM('admin', 'member')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_type" TYPE "public"."user_account_type_enum_old" USING "account_type"::"text"::"public"."user_account_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_account_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_account_type_enum_old" RENAME TO "user_account_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum_old" AS ENUM('active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."project_status_enum_old" USING "status"::"text"::"public"."project_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."project_status_enum_old" RENAME TO "project_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum_old" AS ENUM('dev', 'pm')`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE "public"."role_name_enum_old" USING "name"::"text"::"public"."role_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum_old" RENAME TO "role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_62df391d83fb4cf0f7467db67d6" FOREIGN KEY ("working_unit_id") REFERENCES "working_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_c72d76e480d7334858782543610" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_3d3a5878ae3461d7a099d893340" FOREIGN KEY ("working_unit_id") REFERENCES "working_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_1778afd0b8f381a6aa80b444519" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
