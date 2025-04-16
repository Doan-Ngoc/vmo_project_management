import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskUpdateTable1744451619425 implements MigrationInterface {
    name = 'CreateTaskUpdateTable1744451619425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "task_id" uuid NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_728ca21067b8f88bca4fb0a71dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_updates" ADD CONSTRAINT "FK_faefe2d08bf11dcf2a482040aad" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_updates" ADD CONSTRAINT "FK_26e08711744d4d8860f07cb20ff" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_updates" DROP CONSTRAINT "FK_26e08711744d4d8860f07cb20ff"`);
        await queryRunner.query(`ALTER TABLE "task_updates" DROP CONSTRAINT "FK_faefe2d08bf11dcf2a482040aad"`);
        await queryRunner.query(`DROP TABLE "task_updates"`);
    }

}
