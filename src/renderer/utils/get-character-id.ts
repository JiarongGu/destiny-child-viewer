import { CharacterId } from '@models/character/character-id';

export function getCharacterId(id: string): CharacterId {
  const ids = id.split('_');
  const character = ids[0];
  const variant = ids[1];
  const folder = character.substring(0, 2);
  const index = parseInt(character.substring(2), 10);

  return {
    id,
    character,
    variant,
    folder,
    index
  };
}