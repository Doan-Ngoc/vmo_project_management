import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedByAndDeletedReasonToProjectTable1745641848067 implements MigrationInterface {
    name = 'AddDeletedByAndDeletedReasonToProjectTable1745641848067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_reason" text`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_ea88ee694cadb4afad2af43ce54" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_ea88ee694cadb4afad2af43ce54"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_reason"`);
    }

}
