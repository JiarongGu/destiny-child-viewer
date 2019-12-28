import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { CharacterContainerSink } from './character-container-sink';
import { FixedSizeGrid } from 'react-window';

import * as styles from './character-container.scss';

const IconRenderer = ({ columnIndex, rowIndex, style }) => {
  const sink = useSink(CharacterContainerSink);
  const index = rowIndex * sink.grid.column + columnIndex;
  const character = sink.characters[index];
  if (!character) {
    return null;
  }
  return <img style={style} key={character.id} src={character.icon} />;
};

export const CharacterContainer: React.FunctionComponent = () => {
  const sink = useSink(CharacterContainerSink);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const container = containerRef.current!;
    sink.updateGridBySize(container.clientHeight, container.clientWidth);
    const resizeObserver = new ResizeObserver(_.debounce(() => 
      sink.updateGridBySize(container.clientHeight, container.clientWidth), 
    100));

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
        {IconRenderer}
      </FixedSizeGrid>
    </div>
  );
};
