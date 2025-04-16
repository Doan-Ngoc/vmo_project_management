import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPathAndMethodToPermissionTable1744453302628 implements MigrationInterface {
    name = 'AddPathAndMethodToPermissionTable1744453302628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "path" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "method" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "method"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "path"`);
    }

}
