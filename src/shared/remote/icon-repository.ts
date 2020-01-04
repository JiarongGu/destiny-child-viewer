import { IconModel, IconModelCollection } from '@shared/models';

export interface IIconRepository {
  getCollection(): Promise<IconModelCollection>;
  getIconsByCharacterId(characterId: string): Promise<IconModel>;
  getIconsByVariantId(characterId: string, variantId: string): Promise<{home?: string, battle?: string, spa?: string}>;
  getIcon(characterId: string, variantId: string, type: string): Promise<string>
}