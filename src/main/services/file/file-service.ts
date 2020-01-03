
import * as fs from 'fs-extra';

import { FileReadType } from '@shared/models';
import { IFileService } from '@shared/remote';
import { PathService } from '@main/services';

export class FileService implements IFileService {
  public _pathService: PathService;

  constructor() {
    this._pathService = new PathService();
  }

  public async get<T>(filePath: string, type: FileReadType.Json): Promise<T>;
  public async get(filePath: string, type: FileReadType.ByteArray): Promise<ArrayBuffer>;
  public async get(filePath: string, type: FileReadType.Text): Promise<string>;
  public async get(filePath: string, type: FileReadType): Promise<any>;
  public async get(filePath: string, type: FileReadType) {
    if (type === FileReadType.Json) {
      return await fs.readJSON(filePath);
    }
    const file = await fs.readFile(filePath);

    if (type === FileReadType.Text) {
      return file.toString('utf-8');
    }

    return Uint8Array.from(file);
  }

  public read(filePath: string, type: FileReadType) {
    return this.get(this._pathService.getResourcePath(filePath), type);
  }
}
