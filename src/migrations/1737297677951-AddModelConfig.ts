import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModelConfig1737297677951 implements MigrationInterface {
    name = 'AddModelConfig1737297677951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c658898252e3694655de8a07e7" UNIQUE ("key"), CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "preferred_model" character varying NOT NULL DEFAULT 'openai'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "preferred_model"`);
        await queryRunner.query(`DROP TABLE "configurations"`);
    }

}
