import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Price1735042629818 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the price table
        await queryRunner.createTable(
            new Table({
                name: "price",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "chain",
                        type: "varchar",
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 18,
                        scale: 8,
                    },
                    {
                        name: "timestamp",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        // Add index on chain
        await queryRunner.createIndex(
            "price",
            new TableIndex({
                name: "IDX_CHAIN",
                columnNames: ["chain"],
            })
        );

        // Add index on price
        await queryRunner.createIndex(
            "price",
            new TableIndex({
                name: "IDX_PRICE",
                columnNames: ["price"],
            })
        );

        // Add composite index on chain and timestamp
        await queryRunner.createIndex(
            "price",
            new TableIndex({
                name: "IDX_CHAIN_TIMESTAMP",
                columnNames: ["chain", "timestamp"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop composite index on chain and timestamp
        await queryRunner.dropIndex("price", "IDX_CHAIN_TIMESTAMP");

        // Drop index on price
        await queryRunner.dropIndex("price", "IDX_PRICE");

        // Drop index on chain
        await queryRunner.dropIndex("price", "IDX_CHAIN");

        // Drop the price table
        await queryRunner.dropTable("price");
    }
}
