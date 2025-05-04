import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraintForProject1745813711302 implements MigrationInterface {
    name = 'RemoveUniqueConstraintForProject1745813711302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_dedfea394088ed136ddadeee89c"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name")`);
    }

}
