import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1683862223198 implements MigrationInterface {
  name = 'CreateUserTable1683862223198'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(200) NOT NULL, \`birthday\` varchar(200) NULL, \`email\` varchar(200) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    )
    await queryRunner.query(`DROP TABLE \`user\``)
  }
}
