import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseStringForRoleNameInsteadOfEnum1744810044698
  implements MigrationInterface
{
  name = 'UseStringForRoleNameInsteadOfEnum1744810044698';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "roles" 
            ALTER COLUMN "name" TYPE character varying 
            USING name::text
        `);

    await queryRunner.query(`DROP TYPE IF EXISTS "public"."roles_name_enum"`);

    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."roles_name_enum" AS ENUM('dev', 'pm')`,
    );

    await queryRunner.query(`
            ALTER TABLE "roles" 
            ALTER COLUMN "name" TYPE "public"."roles_name_enum" 
            USING name::text::"public"."roles_name_enum"
        `);
  }
}
