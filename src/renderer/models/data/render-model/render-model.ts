import { RenderModelPNG } from './render-model-png';
import { RenderModelLive2D } from './render-model-live2d';

export type RenderModel = RenderModelLive2D | RenderModelPNG;