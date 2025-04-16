import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNamesToSnakeCase1744456787999 implements MigrationInterface {
  name = 'FixNamesToSnakeCase1744456787999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "task_updates" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedReason"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "startedFrom"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "dueDate"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "working_units" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deleted_reason" text`);
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "due_date" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "working_units" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "due_date"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deleted_reason"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "task_updates" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_units" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "dueDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "startedFrom" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deletedReason" text`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_updates" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
