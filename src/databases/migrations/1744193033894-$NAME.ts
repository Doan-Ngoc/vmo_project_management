import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744193033894 implements MigrationInterface {
    name = ' $NAME1744193033894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c57754862d92d288007ce87b4af"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_role_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_status"`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_status_enum" AS ENUM('pending', 'active', 'disable')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_status" "public"."user_account_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_status"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c57754862d92d288007ce87b4af" FOREIGN KEY ("account_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
