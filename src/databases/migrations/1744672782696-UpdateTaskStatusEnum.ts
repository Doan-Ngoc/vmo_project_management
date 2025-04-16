import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTaskStatusEnum1744672782696 implements MigrationInterface {
  name = ' UpdateTaskStatusEnum1744672782696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."tasks_status_enum" RENAME TO "tasks_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled', 'expired')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "public"."tasks_status_enum" USING "status"::"text"::"public"."tasks_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "dueDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "due_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "due_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "dueDate" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum_old" AS ENUM('in_progress', 'completed', 'expired')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "public"."tasks_status_enum_old" USING "status"::"text"::"public"."tasks_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'in_progress'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tasks_status_enum_old" RENAME TO "tasks_status_enum"`,
    );
  }
}
