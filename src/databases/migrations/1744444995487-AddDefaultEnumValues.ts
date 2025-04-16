import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultEnumValues1744444995487 implements MigrationInterface {
    name = 'AddDefaultEnumValues1744444995487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_type" SET DEFAULT 'member'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "account_type" DROP DEFAULT`);
    }

}
