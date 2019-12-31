import * as React from 'react';

export interface ResizeEvent {
  height: number;
  width: number;
}

export function useResizeObserver(
  elementRef: React.RefObject<HTMLElement>,
  handler: (event: ResizeEvent) => void,
  deps: React.DependencyList
) {
  const createEvent = React.useCallback(() => ({
    height: elementRef.current?.clientHeight || 0,
    width: elementRef.current?.clientWidth || 0
  }), deps);

  React.useLayoutEffect(() => {
    if (elementRef.current) {
      const resizeObserver = new ResizeObserver(() => handler(createEvent()));
      if (handler) {
        handler(createEvent());
      }
      resizeObserver.observe(elementRef.current);
      return () => resizeObserver.unobserve(elementRef.current!);
    }
  }, deps);
}