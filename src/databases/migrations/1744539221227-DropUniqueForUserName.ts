import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUniqueForUserName1744539221227 implements MigrationInterface {
    name = 'DropUniqueForUserName1744539221227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
    }

}
