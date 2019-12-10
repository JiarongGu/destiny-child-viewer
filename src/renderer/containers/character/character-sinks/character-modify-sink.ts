import { sink, effect, state } from 'redux-sink';

import { ChildrenDataService } from '@services/data/children-data-service';

@sink('characterModify', new ChildrenDataService())
export class CharacterModifySink {
  @state public id?: string;
  @state public data?: any;

  constructor(private childrenDataService: ChildrenDataService) {}

  @effect
  public loadCharacter(id: string) {
    this.id = id;
    this.data = this.childrenDataService.get(id);
  }
}
