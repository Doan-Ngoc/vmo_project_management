import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744193251299 implements MigrationInterface {
    name = ' $NAME1744193251299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_account_type_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_type" "public"."user_account_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_type_enum"`);
    }

}
