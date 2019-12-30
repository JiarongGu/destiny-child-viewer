import { CharacterModel, BaseRenderModelCollection, IconModel } from '@models/data';

export interface CharacterMetadata {
  id: string;
  character: CharacterModel;
  icon: IconModel;
  render: BaseRenderModelCollection;
  variants: Array<string>
}