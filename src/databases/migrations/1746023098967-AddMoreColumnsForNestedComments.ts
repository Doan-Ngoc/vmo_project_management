import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreColumnsForNestedComments1746023098967 implements MigrationInterface {
    name = 'AddMoreColumnsForNestedComments1746023098967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "path" character varying`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "level" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD "parent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD CONSTRAINT "FK_4261bbaf7624147fed61d8a91c3" FOREIGN KEY ("parent_id") REFERENCES "task_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_4261bbaf7624147fed61d8a91c3"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP COLUMN "path"`);
    }

}
