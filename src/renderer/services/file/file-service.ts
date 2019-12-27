import * as fs from 'fs-extra';

import { PathService } from '@services/file/path-service';
import { memorizeAsync } from '@decorators/memorize/memorizeAsync';

export enum FileReadType {
  ByteArray = 'bytearray',
  Json = 'json',
  Base64 = 'base64',
  Text = 'text'
}

export class FileService {
  public _pathService: PathService;

  constructor() {
    this._pathService = new PathService();
  }

  public async get<T>(filePath: string, type: FileReadType.Json): Promise<T>;
  public async get(filePath: string, type: FileReadType.ByteArray): Promise<ArrayBuffer>;
  public async get(filePath: string, type: FileReadType.Base64): Promise<string>;
  public async get(filePath: string, type: FileReadType.Text): Promise<string>;
  @memorizeAsync
  public async get(filePath: string, type: FileReadType) {
    if (type === FileReadType.Json) {
      return await fs.readJSON(filePath);
    }
    const file = await fs.readFile(filePath);

    if (type === FileReadType.Text) {
      return file.toString('utf-8');
    }

    const byteArray = Uint8Array.from(file);
    const blob = new Blob([byteArray]);

    if (type === FileReadType.ByteArray) {
      return this.toArrayBuffer(blob);
    }

    if (type === FileReadType.Base64) {
      return this.toBase64(blob);
    }
  }

  public toArrayBuffer(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = error => reject(error);
    });
  }

  public toBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
