import * as fs from 'fs';
import * as path from 'path';

import { reduceMapAsync } from '@shared/utils';

export type FileStats = {
  path: string,
  isDirectory: boolean;
  files?: FileStatsCollection
}
export type FileStatsCollection = { [key: string]: FileStats };

export class FileHelper {
  public static isDirectory(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.lstat(filePath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.isDirectory());
        }
      })
    });
  }

  public static readDirectory(filePath: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      fs.readdir(filePath, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.map(file => path.join(filePath, file)));
        }
      });
    });
  }

  public static exists(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(filePath, (exists) => {
        resolve(exists);
      })
    });
  }

  public static getFileNameWithOutExtension(filePath: string) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath, ext);
    return fileName;
  }

  public static getFileName(filePath: string) {
    return path.basename(filePath);
  }

  public static async readDirectoryDeep(filePath: string): Promise<FileStatsCollection> {
    return await reduceMapAsync<string, FileStats>(await this.readDirectory(filePath),
      suhPath => this.getFileNameWithOutExtension(suhPath),
      async subPath => {
        const isDirectory = await this.isDirectory(subPath);
        const fileStats: FileStats = { isDirectory, path: subPath };
        if (isDirectory) {
          fileStats.files = await this.readDirectoryDeep(subPath);
        }
        return fileStats;
      }
    );
  }
}