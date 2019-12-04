declare module 'global' {
  global {
    export type WebGLRenderer = WebGLRenderingContext | WebGL2RenderingContext;

    export class Live2D {
      public static init(): void;
      public static dispose(): void;
      public static setGL(context: WebGLRenderer): void;
    }

    export class L2DModelMatrix {
      constructor(width: number, height: number);

      public getArray(): Array<number>;
      public setWidth(modelScale: number);
      public setCenterPosition(modelX: number, modelY: number);
    }

    export class Live2DModelWebGL {
      public static loadModel(model: any): Live2DModel;
    }

    export class L2DMotionManager {
      public updateParam(live2DModel: Live2DModel): void;
      public isFinished(): boolean;
      public startMotion(motion: Live2DMotion): void;
    }

    export class Live2DModel {
      public static loadModel(model: ArrayBuffer);
      public isPremultipliedAlpha(): boolean;
      public setTexture(times: number, texture: WebGLTexture);
      public setGL(context: RenderingContext);
      public getCanvasHeight(): number;
      public getCanvasWidth(): number;
      public setMatrix(matrix: Array<number>);
      public update(): void;
      public draw(): void;
    }

    export class Live2DMotion {
      public static loadMotion(motion: DataView): Live2DMotion;
      public _$eo: number;
      public _$dP: number;
    }
  }
}
