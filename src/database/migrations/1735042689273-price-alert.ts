import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class PriceAlert1735042689273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the price_alert table
        await queryRunner.createTable(
            new Table({
                name: "price_alert",
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
                        name: "targetPrice",
                        type: "decimal",
                        precision: 18,
                        scale: 8,
                    },
                    {
                        name: "email",
                        type: "varchar",
                    },
                    {
                        name: "isTriggered",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            })
        );

        // Add a composite index on chain and email
        await queryRunner.createIndex(
            "price_alert",
            new TableIndex({
                name: "IDX_CHAIN_EMAIL",
                columnNames: ["chain", "email"],
            })
        );

        // Add an index on targetPrice
        await queryRunner.createIndex(
            "price_alert",
            new TableIndex({
                name: "IDX_TARGET_PRICE",
                columnNames: ["targetPrice"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the composite index on chain and email
        await queryRunner.dropIndex("price_alert", "IDX_CHAIN_EMAIL");

        // Drop the index on targetPrice
        await queryRunner.dropIndex("price_alert", "IDX_TARGET_PRICE");

        // Drop the price_alert table
        await queryRunner.dropTable("price_alert");
    }
}
