import { MemorizeContext, memorizeAsync } from 'ts-memorize-decorator';

import { FileReadType} from '@shared';
import { RemoteService, IFileService, RemoteServiceType } from '@shared/remote';
import { BlobReadType } from './blob-read-type.enum';

export class BlobService {
  public static cacheContext = new MemorizeContext();

  private readonly _fileService = new RemoteService<IFileService>(RemoteServiceType.File);
  private readonly _objectUrls: Array<string> = [];

  @memorizeAsync(BlobService.cacheContext)
  public async read(filePath: string, type: BlobReadType) {
    const fileReadType = this.toFileType(type);
    const result = await this._fileService.invoke('read', filePath, fileReadType);

    if (fileReadType !== FileReadType.ByteArray) {
      return result;
    }

    const blob = new Blob([result]);

    if (type === BlobReadType.URL) {
      const url = URL.createObjectURL(blob);
      this._objectUrls[filePath] = url;
      return url;
    }

    if (type === BlobReadType.ByteArray) {
      return this.toArrayBuffer(blob);
    }

    if (type === BlobReadType.Base64) {
      return this.toBase64(blob);
    }

    return result;
  }

  private toFileType(readType: BlobReadType): FileReadType {
    switch (readType) {
      case BlobReadType.URL:
      case BlobReadType.ByteArray:
      case BlobReadType.Base64:
        return FileReadType.ByteArray;
      default:
        return readType as FileReadType;
    }
  }

  private toArrayBuffer(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = error => reject(error);
    });
  }

  private toBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}