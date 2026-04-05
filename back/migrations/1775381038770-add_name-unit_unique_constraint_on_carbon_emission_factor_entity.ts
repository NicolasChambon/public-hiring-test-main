import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameUnitUniqueConstraintOnCarbonEmissionFactorEntity1775381038770 implements MigrationInterface {
    name = 'AddNameUnitUniqueConstraintOnCarbonEmissionFactorEntity1775381038770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_emission_factors" ADD CONSTRAINT "UQ_dbc74d97fa87f01032a6275d6af" UNIQUE ("name", "unit")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_emission_factors" DROP CONSTRAINT "UQ_dbc74d97fa87f01032a6275d6af"`);
    }

}
