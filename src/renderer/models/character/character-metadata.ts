import { CharacterModel, BaseRenderModelCollection, IconModel } from '@shared/models';

export interface CharacterMetadata {
  id: string;
  character: CharacterModel;
  icon: IconModel;
  render: BaseRenderModelCollection;
  variants: Array<string>;
  orderIndex: number;
}