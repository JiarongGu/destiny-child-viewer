import { IconModel, IconModelCollection } from '@shared/models';

export interface IIconRepository {
  listIcons(): Promise<IconModelCollection>;
  getCharacterIcons(characterId: string): Promise<IconModel>;
  getVariantIcons(characterId: string, variantId: string): Promise<{home?: string, battle?: string, spa?: string}>;
  getIcon(characterId: string, variantId: string, type: string): Promise<string>
}