import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTechLeadNumberToProject1744812580037 implements MigrationInterface {
    name = 'AddTechLeadNumberToProject1744812580037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "tech_lead_number" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "tech_lead_number"`);
    }

}
