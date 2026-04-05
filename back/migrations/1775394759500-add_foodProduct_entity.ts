import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFoodProductEntity1775394759500 implements MigrationInterface {
    name = 'AddFoodProductEntity1775394759500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ingredients" jsonb NOT NULL, "carbonFootprintInKgCO2e" double precision, CONSTRAINT "UQ_2f4d514f7e5374ce4b3091c0361" UNIQUE ("name"), CONSTRAINT "PK_3aca8796e89325904061ed18b12" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "food_products"`);
    }

}
