import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTaskMemberColumns1744448274671
  implements MigrationInterface
{
  name = 'RenameTaskMemberColumns1744448274671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First drop the existing foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "task_member" DROP CONSTRAINT "FK_4d829d71833cb73f4923dd0b69a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" DROP CONSTRAINT "FK_46acc098d4710a1cf59c70e350d"`,
    );

    // Drop the existing indexes
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d829d71833cb73f4923dd0b69"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_46acc098d4710a1cf59c70e350"`,
    );

    // Rename the columns
    await queryRunner.query(
      `ALTER TABLE "task_member" RENAME COLUMN "tasksId" TO "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" RENAME COLUMN "usersId" TO "user_id"`,
    );

    // Create new indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_task_member_task_id" ON "task_member" ("task_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_task_member_user_id" ON "task_member" ("user_id") `,
    );

    // Add back the foreign key constraints with new column names
    await queryRunner.query(
      `ALTER TABLE "task_member" ADD CONSTRAINT "FK_task_member_task_id" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" ADD CONSTRAINT "FK_task_member_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "task_member" DROP CONSTRAINT "FK_task_member_task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" DROP CONSTRAINT "FK_task_member_user_id"`,
    );

    // Drop the new indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_task_member_task_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_task_member_user_id"`);

    // Rename columns back
    await queryRunner.query(
      `ALTER TABLE "task_member" RENAME COLUMN "task_id" TO "tasksId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" RENAME COLUMN "user_id" TO "usersId"`,
    );

    // Recreate original indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_4d829d71833cb73f4923dd0b69" ON "task_member" ("tasksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46acc098d4710a1cf59c70e350" ON "task_member" ("usersId") `,
    );

    // Add back original foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "task_member" ADD CONSTRAINT "FK_4d829d71833cb73f4923dd0b69a" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_member" ADD CONSTRAINT "FK_46acc098d4710a1cf59c70e350d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
