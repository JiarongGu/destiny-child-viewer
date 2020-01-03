import { FileReadType } from '@shared/models';

enum BlobReadTypeBase {
  Base64 = 'base64',
  URL= 'url',
}

export type BlobReadType = FileReadType | BlobReadTypeBase;
export const BlobReadType = { ...BlobReadTypeBase, ...FileReadType };