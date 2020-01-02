import { MouseEventHandler, DependencyList, useRef, useState, useCallback } from 'react';

export interface DragPosition {
  x: number;
  y: number;
}

export type DragEventHandler = (event: DragPosition) => void;

export function useDragPosition(handler: DragEventHandler, deps: DependencyList)
export function useDragPosition(handler: DragEventHandler, mouseHandler: MouseEventHandler, deps: DependencyList)
export function useDragPosition(
  handler: DragEventHandler,
  second: MouseEventHandler | DependencyList,
  third?: DependencyList
) {
  const dragPosition = useRef<DragPosition>();
  const deps = third || second as React.DependencyList;
  const mouseHandler = third ? second as React.MouseEventHandler : null;

  const [moving, setMoving] = useState(false);

  const onMouseDown = useCallback(event => {
    dragPosition.current = {
      x: event.clientX,
      y: event.clientY
    };
    mouseHandler && mouseHandler(event);
  }, deps);

  const onMouseUp = useCallback((event) => {
    dragPosition.current = undefined;
    setMoving(false);
    mouseHandler && mouseHandler(event);
  }, deps);

  const onMouseMove = useCallback(event => {
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
      mouseHandler && mouseHandler(event);
    }
  }, deps);

  return { onMouseDown, onMouseUp, onMouseMove, moving }
}