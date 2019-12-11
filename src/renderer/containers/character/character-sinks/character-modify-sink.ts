import { sink, effect, state } from 'redux-sink';

import { ChildDataService } from '@services/data/child-data-service';

@sink('characterModify', new ChildDataService())
export class CharacterModifySink {
  @state public id?: string;
  @state public data?: any;

  constructor(private childDataService: ChildDataService) {}

  @effect
  public loadCharacter(id: string) {
    this.id = id;
    this.data = this.childDataService.get(id);
  }
}
