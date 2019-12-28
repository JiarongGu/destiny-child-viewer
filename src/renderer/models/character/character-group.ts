import { ChildDataModel } from './../data/child-data-model';

export interface CharacterGroup {
  id: string;
  data: ChildDataModel;
  icon: string;
  live2ds: Array<{ icon: string, variant: string }>;
}