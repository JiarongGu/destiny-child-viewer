import * as FileSync from 'lowdb/adapters/FileSync';
import * as lowdb from 'lowdb';
import * as path from 'path';

import { PathService } from '@services/file/path-service';
import { ChildData } from '@models/data/child-data';
import { ChildDataModel } from '@models/data/child-data-model';
import { ChildDataAdditional } from '@models/data/child-data-additional';

export class ChildrenDataService {
  public _childrenDataPath: string;
  public _childrenAdditionalDataPath: string;
  public _childrenData: lowdb.LowdbSync<string>;
  public _childrenAdditionalData: lowdb.LowdbSync<any>;

  constructor() {
    const dataPath = new PathService().dataPath;
    this._childrenDataPath = path.resolve(dataPath, 'children.json');
    this._childrenAdditionalDataPath = path.resolve(dataPath, 'children-additional.json');
    this._childrenData = lowdb(new FileSync(this._childrenDataPath));
    this._childrenAdditionalData = lowdb(new FileSync(this._childrenAdditionalDataPath));
  }

  public get(id: string): ChildDataModel {
    const ids = id.split('_');
    const c_id = ids[0];
    const v_id = ids[1];

    const originalData = this._childrenData.get(c_id).value() as ChildData;
    const additional = this._childrenAdditionalData.get(c_id).value() as ChildDataAdditional;
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
