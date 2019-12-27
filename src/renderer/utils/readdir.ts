import * as fs from 'fs';
import * as path from 'path';

export function readdir(dir: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map(file => path.join(dir, file)));
      }
    });
  });
}