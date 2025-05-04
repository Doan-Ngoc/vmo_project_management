import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCommentPathTypeFromVarCharToText1746183740684 implements MigrationInterface {
    name = 'ChangeCommentPathTypeFromVarCharToText1746183740684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "path" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "path" character varying`);
    }

}
