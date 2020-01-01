import * as React from 'react';

export interface DragPosition {
  x: number;
  y: number;
}

export function useDragPosition(handler: (event: DragPosition) => void, deps: React.DependencyList) {
  const dragPosition = React.useRef<DragPosition>();

  const [moving, setMoving] = React.useState(false);

  const onMouseDown = React.useCallback(event => {
    dragPosition.current = {
      x: event.clientX,
      y: event.clientY
    };
  }, deps);

  const onMouseUp = React.useCallback(() => {
    dragPosition.current = undefined;
    setMoving(false);
  }, deps);

  const onMouseMove = React.useCallback(event => {
    if (dragPosition.current) {
      if (!moving) {
        setMoving(true);
      }
      const x = event.clientX - dragPosition.current.x;
      const y = event.clientY - dragPosition.current.y;

      dragPosition.current = {
        x: event.clientX, y: event.clientY
      };

      if (handler) {
        handler({ x, y });
      }
    }
  }, deps);

  return { onMouseDown, onMouseUp, onMouseMove, moving }
}