import * as React from 'react';
import { FixedSizeGrid } from 'react-window';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { CharacterIconSink } from './character-icon-sink';

import * as styles from './character-icon.scss';
import { CharacterIconRenderer } from './character-icon-renderer';
import { useResizeObserver } from '@hooks';

export const CharacterIcon = () => {
  const sink = useSink(CharacterIconSink);
  const grid = sink.grid;
  const valid = grid.height > 0 && grid.width > 0;

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    sink.load();
  }, []);

  useResizeObserver(
    containerRef,
    _.debounce(({ height, width }) => sink.updateGridBySize(height, width), 100),
    []
  );

  return (
    <div className={styles.container} ref={containerRef}>
      {valid && (
        <FixedSizeGrid
          columnCount={grid.column}
          rowCount={grid.row}
          rowHeight={128}
          columnWidth={128}
          height={grid.height}
          width={grid.width}
          style={{ overflowX: 'hidden' }}
        >
          {CharacterIconRenderer}
        </FixedSizeGrid>
      )}
    </div>
  );
};
