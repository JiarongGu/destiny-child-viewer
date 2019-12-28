import * as React from 'react';

import { Live2DRenderComponents } from '@services/live2d/live2d-service';

export function useLiv2dCanvas(components: Live2DRenderComponents) {
  const onCanvasDraw = React.useCallback(() => {
    const idleMotion = components && components.motions.idle![0];
    if (idleMotion && components.motionManager.isFinished()) {
      components.motionManager.startMotion(idleMotion);
    }
  }, [components]);

  const onCanvasClick = React.useCallback(() => {
    if (components.motions.attack) {
      components.motionManager.startMotion(components.motions.attack[0]);
    }
  }, [components]);
  
  return { onCanvasDraw, onCanvasClick };
}