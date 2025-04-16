import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNullableValueInPermissionTable1744454073702 implements MigrationInterface {
    name = 'ChangeNullableValueInPermissionTable1744454073702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "path" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "method" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "method" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "path" DROP NOT NULL`);
    }

}
