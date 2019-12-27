import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as fs from 'fs';
import * as path from 'path';

import { PathService } from '@services/file/path-service';
import { getCharacterId, reduceMap } from '@utils';
import { MetadataService } from './metadata-service';
import { memorizeAsync } from '@decorators';

export class IconDataService {
  private _pathService: PathService;
  private _metadataService: MetadataService;

  constructor() {
    this._pathService = new PathService;
    this._metadataService = new MetadataService();
  }

  public async getPortraits() {
    const characters = await this._metadataService.getCharacterMetadata();
    const filePath = this._pathService.getDataPath('icon-portrait.json');
    const keys = Object.keys(characters).filter(id => !id.startsWith('s'));
    return await this.getIconMap(filePath, this._pathService.getAssetPath('icon/portrait'), keys);
  }

  public async getPortraitsBattle() {
    const characters = await this._metadataService.getCharacterMetadata();
    const filePath = this._pathService.getDataPath('icon-portrait-battle.json');
    const keys = Object.keys(characters).filter(id => !id.startsWith('s'));
    return await this.getIconMap(filePath, this._pathService.getAssetPath('icon/portrait_battle'), keys);
  }

  private async getIconMap(json:string, iconDir: string, keys: Array<string>) {
    const iconMap = await lowdb(new FileAsync(json));
    let index = 0;
    let folder = '';

    await Promise.all(keys.map(async id => {
      const ids = getCharacterId(id);

      if (folder !== ids.folder) {
        index = 0;
        folder = ids.folder;
      } else {
        index++;
      }
      const fileId = index;
      const map = iconMap.get(id).value();
      if (!map) {
        const files = await this.getIconFilesIndex(iconDir, folder);
        const file = files[fileId];
        iconMap.set(id, file).write();
      }
    }));

    return iconMap.value();
  }

  @memorizeAsync
  private getIconFiles(iconDir:string, folder: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const dir = `${iconDir}/${folder}`;
      fs.readdir(dir, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.map(file => path.join(dir, file)));
        }
      });
    });
  }

  @memorizeAsync
  private async getIconFilesIndex(iconDir:string, folder: string): Promise<{ [key: number]: string }> {
    const files = await this.getIconFiles(iconDir, folder);

    return reduceMap(files, file => {
      const ext = path.extname(file);
      const fileName = path.basename(file, ext);
      const index = parseInt(fileName, 10);
      return index;
    }, file => file);
  }
}