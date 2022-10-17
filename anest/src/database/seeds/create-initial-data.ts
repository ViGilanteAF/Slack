import { Channels } from 'src/entities/Channels';
import { Workspaces } from 'src/entities/Workspaces';
import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: '일반', WorkspaceId: 1, private: false }])
      .execute();
  }
}
