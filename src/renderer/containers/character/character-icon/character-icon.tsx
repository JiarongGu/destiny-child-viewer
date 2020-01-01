import * as React from 'react';
import { FixedSizeGrid } from 'react-window';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { useResizeObserver, SiderHook } from '@hooks';

import { CharacterIconRenderer } from './character-icon-renderer';
import { CharacterIconSink } from './character-icon-sink';
import { CharacterIconSider } from './character-icon-sider/character-icon-sider';

import * as styles from './character-icon.scss';

export const CharacterIcon = () => {
  const sink = useSink(CharacterIconSink, sink => [sink.grid]);
  const grid = sink.grid;
  const valid = grid.height > 0 && grid.width > 0;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<FixedSizeGrid>(null);

  React.useEffect(() => {
    sink.load();
    if (sink.scrollTop) {
      gridRef.current?.scrollTo({ scrollLeft: 0, scrollTop: sink.scrollTop });
    }

    return () => {
      sink.scrollTop = (gridRef.current?.state as any)?.scrollTop || 0;
    };
  }, []);

  useResizeObserver(
    containerRef,
    _.debounce(({ height, width }) => sink.updateGridBySize(height, width), 100),
    []
  );

  SiderHook.useSider(CharacterIconSider, { width: '300px' });

  return (
    <div className={styles.container} ref={containerRef}>
      {valid && (
        <FixedSizeGrid
          ref={gridRef}
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
