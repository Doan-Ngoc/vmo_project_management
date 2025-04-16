import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1744266617648 implements MigrationInterface {
    name = ' $NAME1744266617648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum" RENAME TO "role_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('dev', 'pm')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "name" TYPE "public"."role_name_enum" USING "name"::"text"::"public"."role_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum_old" AS ENUM('admin', 'regular', 'leader', 'member')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "name" TYPE "public"."role_name_enum_old" USING "name"::"text"::"public"."role_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum_old" RENAME TO "role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
