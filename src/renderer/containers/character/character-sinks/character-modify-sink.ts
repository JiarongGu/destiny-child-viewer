import { sink, effect, state } from 'redux-sink';

import { CharacterService } from '@services/character/character-service';

@sink('characterModify', new CharacterService())
export class CharacterModifySink {
  @state public id?: string;
  @state public data?: any;

  constructor(private _characterService: CharacterService) { }

  @effect
  public loadCharacter(characterId: string) {
    this.id = characterId;
    this.data = this._characterService.getCharacterMetadata(characterId);
  }
}
