export interface CharacterIdentifiers {
  characterId: string;
  variantId: string;
  folderId: string;
  folderIndex: number;
  objectMap: string;
}

export class CharacterHelper {
  public static getCharacterFullId(characterId: string, variantId: string): string {
    return `${characterId}_${variantId}`;
  }

  public static getCharacterIdentifiers(fullId: string): CharacterIdentifiers {
    const ids = fullId.split('_');

    // get character ids
    const characterId = ids[0];
    const variantId = ids[1];

    // get folder ids
    const matches = /(?<folder>[a-zA-z]*[0-9])(?<index>.*)/.exec(characterId);
    const folderId = matches?.groups?.folder || '';
    const folderIndex = parseInt(matches?.groups?.index || '', 10);

    // get object map
    const objectMap = fullId.replace(/\_/g, '.');

    return {
      characterId,
      variantId,
      folderId,
      folderIndex,
      objectMap
    };
  }
}

export function getCharacterFullId(characterId: string, variantId: string): string {
  return `${characterId}_${variantId}`;
}