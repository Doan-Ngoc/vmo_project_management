import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnToProjectAndComment1745414493735 implements MigrationInterface {
    name = 'AddDeletedAtColumnToProjectAndComment1745414493735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "deleted_at"`);
    }

}
