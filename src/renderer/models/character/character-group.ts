import { ChildDataModel } from './../data/child-data-model';

export interface CharacterGroup {
  id: string;
  data: ChildDataModel;
  live2dDefault: { icon: string, variant: string };
  live2ds: Array<{ icon: string, variant: string }>;
}