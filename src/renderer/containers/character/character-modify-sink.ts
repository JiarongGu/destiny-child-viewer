import { sink, effect, state } from 'redux-sink';

import { ChildrenDataService } from '@services/data/children-data-service';

@sink('characterModify', new ChildrenDataService())
export class CharacterModifySink {
  @state public id?: string;

  constructor(private childrenDataService: ChildrenDataService) {}

  @effect
  public loadCharacter(id: string) {
    this.id = id;
    const data = this.childrenDataService.get(id);
  }
}
