import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskMemberJoinTable1744448274670 implements MigrationInterface {
    name = 'CreateTaskMemberJoinTable1744448274670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_member" ("tasksId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_0cd17d8eea8f996ca23d39e32ee" PRIMARY KEY ("tasksId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d829d71833cb73f4923dd0b69" ON "task_member" ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_46acc098d4710a1cf59c70e350" ON "task_member" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "task_member" ADD CONSTRAINT "FK_4d829d71833cb73f4923dd0b69a" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_member" ADD CONSTRAINT "FK_46acc098d4710a1cf59c70e350d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_member" DROP CONSTRAINT "FK_46acc098d4710a1cf59c70e350d"`);
        await queryRunner.query(`ALTER TABLE "task_member" DROP CONSTRAINT "FK_4d829d71833cb73f4923dd0b69a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46acc098d4710a1cf59c70e350"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d829d71833cb73f4923dd0b69"`);
        await queryRunner.query(`DROP TABLE "task_member"`);
    }

}
