import { CharacterModel, CharacterBase, CharacterTitle } from '@shared/models';

export interface ICharacterRepository {
  ListCharacters(): Promise<{ [key: string]: CharacterModel }>;
  getCharacter(characterId: string): Promise<CharacterModel>;
  getCharacterBase(characterId: string): Promise<CharacterBase & CharacterTitle>;
  saveCharacter(characterId: string, model: CharacterModel): void;
}