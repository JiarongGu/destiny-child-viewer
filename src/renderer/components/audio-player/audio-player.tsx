import * as React from 'react';

export interface AudioPlayer {
  play: () => void;
  pause: () => void;
  seek: (value: number) => void;
}

export interface AudioPlayerProps {
  src?: string;
  loop?: boolean;
  play?: boolean;
  volume?: number; // 0 - 100
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

function formatSeconds(seconds) {
  const minutesDisplay = Math.floor(seconds / 60);
  const secondsDisplay = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutesDisplay}:${secondsDisplay}`;
}

const AudioPlayerComponent: React.RefForwardingComponent<AudioPlayer, AudioPlayerProps> = (
  { play, src, loop, volume, onPlay },
  ref
) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const state = React.useRef({
    playing: false,
    time: 0,
    volume: 0,
  });

  const onTimeUpdate = React.useCallback((event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    state.current.time = (event.target as any).currentTime;
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      play: () => audioRef.current?.play(),
      pause: () => {},
      seek: value => {}
    }),
    []
  );

  React.useEffect(() => {
    if (audioRef.current && play) {
      console.log(audioRef.current.volume);
      audioRef.current
        .play()
        .then(() => onPlay && onPlay())
        .catch(err => {
          if (err.code !== 20) throw err;
        });
    }
    if (audioRef.current && !play) {
      audioRef.current.pause();
    }

    return () => audioRef.current?.pause();
  }, [play, src, onPlay]);

  React.useEffect(() => {
    if (audioRef.current && volume) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return <audio ref={audioRef} src={src} loop={loop} onPlay={onPlay} onTimeUpdate={onTimeUpdate} />;
};

export const AudioPlayer = React.forwardRef(AudioPlayerComponent);
