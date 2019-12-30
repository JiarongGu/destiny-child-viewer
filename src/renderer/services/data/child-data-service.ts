import * as FileSync from 'lowdb/adapters/FileSync';
import * as lowdb from 'lowdb';
import * as path from 'path';
import * as _ from 'lodash';

import { PathService } from '@services';
import { ChildData } from '@models/data/child-data';
import { ChildVariantModel } from '@models/data/child-variant-model';
import { ChildDataAdditional } from '@models/data/child-data-additional';
import { getCharacterId } from '@utils';
import { ChildDataModel } from '@models/data/child-data-model';

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

  public getCharacter(characterId: string): ChildDataModel {
    const data = this._childData.get(characterId).value() as ChildData;
    const additional = this._childAdditionalData.get(characterId).value() as ChildDataAdditional;
    return _.merge({}, data, additional);
  }

  public getVariant(id: string): ChildVariantModel {
    const ids = getCharacterId(id);
    const result = this.getCharacter(ids.character);

    const variant = result.variants[ids.variant];

    const model: ChildVariantModel = {
      id: ids.character,
      variant: ids.variant,
      name: result.name,
      title: variant.title,
      type: result.type,
      stars: result.stars,
      positions: variant.positions,
      icon: variant.icon,
    };

    return model;
  }

  public set(model: ChildVariantModel) { }
}
