import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTablesToPlural1744426413675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "users"`);
    await queryRunner.query(
      `ALTER TABLE "working_unit" RENAME TO "working_units"`,
    );
    await queryRunner.query(`ALTER TABLE "role" RENAME TO "roles"`);
    await queryRunner.query(`ALTER TABLE "permission" RENAME TO "permissions"`);
    await queryRunner.query(`ALTER TABLE "project" RENAME TO "projects"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "user"`);
    await queryRunner.query(
      `ALTER TABLE "working_units" RENAME TO "working_unit"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" RENAME TO "role"`);
    await queryRunner.query(`ALTER TABLE "permissions" RENAME TO "permission"`);
    await queryRunner.query(`ALTER TABLE "projects" RENAME TO "project"`);
  }
}
