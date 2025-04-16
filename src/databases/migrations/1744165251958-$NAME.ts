import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744165251958 implements MigrationInterface {
    name = ' $NAME1744165251958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c57754862d92d288007ce87b4af"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "account_role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c57754862d92d288007ce87b4af" FOREIGN KEY ("account_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c57754862d92d288007ce87b4af"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "account_role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c57754862d92d288007ce87b4af" FOREIGN KEY ("account_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
