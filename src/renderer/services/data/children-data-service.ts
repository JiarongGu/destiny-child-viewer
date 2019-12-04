import * as FileSync from 'lowdb/adapters/FileSync';
import * as lowdb from 'lowdb';

import { FileService } from './../file/file-service';
import { ChildInfo } from '@models/data/children-data';

export class ChildrenDataService {
  public filePath: string;
  public adapter: lowdb.AdapterSync;
  public db: lowdb.LowdbSync<any>;

  constructor() {
    this.filePath = new FileService().getResourcePath('data/children.json');
    this.adapter = new FileSync(this.filePath);
    this.db = lowdb(this.adapter);
  }

  public get(id: string) {
    const ids = id.split('_');
    const c_id = ids[0];
    const v_id = ids[1];

    return this.db.get(c_id).value();
  }
}
