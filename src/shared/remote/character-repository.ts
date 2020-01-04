import { CharacterModel } from '@shared/models';

export interface ICharacterRepository {
  getCollection(): Promise<{ [key: string]: CharacterModel }>;
  getCharacter(characterId: string): Promise<CharacterModel>;
  saveCharacter(characterId: string, model: CharacterModel): void;
}