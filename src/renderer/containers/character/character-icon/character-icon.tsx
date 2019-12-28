import * as React from 'react';
import { FixedSizeGrid } from 'react-window';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { CharacterIconSink } from './character-icon-sink';

import * as styles from './character-icon.scss';
import { CharacterIconRenderer } from './character-icon-renderer';

export const CharacterIcon = () => {
  const sink = useSink(CharacterIconSink);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const container = containerRef.current!;
    sink.updateGridBySize(container.clientHeight, container.clientWidth);
    const resizeObserver = new ResizeObserver(
      _.debounce(() => sink.updateGridBySize(container.clientHeight, container.clientWidth), 100)
    );

    resizeObserver.observe(container);
    return () => resizeObserver.unobserve(container);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <FixedSizeGrid
        columnCount={sink.grid.column}
        rowCount={sink.grid.row}
        rowHeight={128}
        columnWidth={128}
        height={sink.grid.height}
        width={sink.grid.width}
      >
        {CharacterIconRenderer}
      </FixedSizeGrid>
    </div>
  );
};
