import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAccountStatusEnum1745223326032 implements MigrationInterface {
    name = 'ChangeAccountStatusEnum1745223326032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_account_status_enum" RENAME TO "users_account_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_account_status_enum" AS ENUM('unverified', 'pending_activation', 'active', 'disable')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" TYPE "public"."users_account_status_enum" USING "account_status"::"text"::"public"."users_account_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" SET DEFAULT 'unverified'`);
        await queryRunner.query(`DROP TYPE "public"."users_account_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_account_status_enum_old" AS ENUM('pending', 'active', 'disable')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" TYPE "public"."users_account_status_enum_old" USING "account_status"::"text"::"public"."users_account_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."users_account_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_account_status_enum_old" RENAME TO "users_account_status_enum"`);
    }

}
