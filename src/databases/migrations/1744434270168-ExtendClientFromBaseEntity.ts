import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendClientFromBaseEntity1744434270168 implements MigrationInterface {
    name = 'ExtendClientFromBaseEntity1744434270168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "createdAt"`);
    }

}
