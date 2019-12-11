import * as FileSync from 'lowdb/adapters/FileSync';
import * as lowdb from 'lowdb';
import * as path from 'path';

import { PathService } from '@services/file/path-service';
import { ChildData } from '@models/data/child-data';
import { ChildDataModel } from '@models/data/child-data-model';
import { ChildDataAdditional } from '@models/data/child-data-additional';

export class ChildDataService {
  public _childDataPath: string;
  public _childAdditionalDataPath: string;
  public _childData: lowdb.LowdbSync<string>;
  public _childAdditionalData: lowdb.LowdbSync<any>;

  constructor() {
    const dataPath = new PathService().dataPath;
    this._childDataPath = path.resolve(dataPath, 'child.json');
    this._childAdditionalDataPath = path.resolve(dataPath, 'child-additional.json');
    this._childData = lowdb(new FileSync(this._childDataPath));
    this._childAdditionalData = lowdb(new FileSync(this._childAdditionalDataPath));
  }

  public get(id: string): ChildDataModel {
    const ids = id.split('_');
    const c_id = ids[0];
    const v_id = ids[1];

    const originalData = this._childData.get(c_id).value() as ChildData;
    const additional = this._childAdditionalData.get(c_id).value() as ChildDataAdditional;
    const data = Object.assign({}, originalData, additional);
    const variant = data.variants[v_id];

    const model: ChildDataModel = {
      id: c_id,
      variant: v_id,
      name: data.name,
      title: variant.title,
      type: data.type,
      stars: data.stars,
      positions: variant.positions
    };

    return model;
  }

  public set(model: ChildDataModel) {}
}
