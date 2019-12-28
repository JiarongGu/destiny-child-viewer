import { CharacterId } from '@models/character/character-id';

export function getCharacterId(id: string): CharacterId {
  const ids = id.split('_');
  const character = ids[0];
  const variant = ids[1];

  const matches = /(?<folder>[a-zA-z]*[0-9])(?<index>.*)/.exec(character);
  const folder = matches?.groups?.folder || '';
  const index = parseInt(matches?.groups?.index || '', 10);
  const map = id.replace(/\_/g, '.');

  return {
    id,
    character,
    variant,
    folder,
    index,
    map
  };
}