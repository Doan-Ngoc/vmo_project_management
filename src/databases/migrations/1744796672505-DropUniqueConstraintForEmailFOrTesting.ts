import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUniqueConstraintForEmailFOrTesting1744796672505 implements MigrationInterface {
    name = 'DropUniqueConstraintForEmailFOrTesting1744796672505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

}
