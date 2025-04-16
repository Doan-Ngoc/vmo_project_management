import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameClientToClients1744425551102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" RENAME TO "clients"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" RENAME TO "client"`);
  }
}
