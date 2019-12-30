import { RenderModel } from './render-model';

export interface BaseRenderModelCollection {
  [key: string]: RenderModel;
}


export interface RenderModelCollection {
  [key: string]: BaseRenderModelCollection;
}