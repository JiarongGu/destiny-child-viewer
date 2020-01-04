import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { CharacterViewerThemeSink } from '../character-viewer-theme-sink';

import * as styles from './character-viewer-sider-theme.scss';
import { AudioPlayer } from '@components';
import { MusicModel } from '@shared';

export const CharacterViewerSiderTheme = () => {
  const themeSink = useSink(CharacterViewerThemeSink);
  const audioRef = React.useRef<AudioPlayer>(null);
  const { sound, musics } = themeSink;

  React.useEffect(() => {
    themeSink.loadMetadata();

    return () => {
      themeSink.sound = undefined;
    };
  }, []);

  const musicsArray = React.useMemo(
    () =>
      _.transform<MusicModel, Array<{ key: string } & MusicModel>>(
        musics,
        (acc, curr, key) => (acc.push({ ...curr, key }), acc),
        []
      ),
    [musics]
  );

  // React.useEffect(() => {
  //   audioRef.current?.play();
  // }, [sound])

  return (
    <div className={styles.container}>
      <div className={styles.musicGroup}>
        {musicsArray.map((music, index) => (
          <div className={styles.musicItem} key={index} onClick={() => themeSink.loadSound(music.filePath)}>
            <div>{music.title}</div>
            <div>{music.length}</div>
          </div>
        ))}
      </div>
      <AudioPlayer ref={audioRef} play={!!sound} src={sound} loop={true} />
    </div>
  );
};
