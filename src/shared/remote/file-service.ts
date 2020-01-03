import { FileReadType } from '@shared/models';

export interface IFileService {
  read(filePath: string, type: FileReadType): Promise<any>;
}