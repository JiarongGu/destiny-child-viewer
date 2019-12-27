
import * as path from 'path';

export function getFilename(filePath: string) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath, ext);
  return fileName;
}