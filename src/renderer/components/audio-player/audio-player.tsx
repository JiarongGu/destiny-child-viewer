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
  { play, src, loop },
  ref
) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const state = React.useRef({
    playing: false,
    time: 0
  });

  const onTimeUpdate = React.useCallback((event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    state.current.time = (event.target as any).currentTime;
  }, []);

  const onPlay = React.useCallback(event => {
    console.log(event);
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
      audioRef.current.play();
    }
    if (audioRef.current && !play) {
      audioRef.current.pause();
    }
  }, [play, src]);

  return (
    <audio 
      ref={audioRef} 
      src={src}
      loop={loop} 
      onPlay={onPlay} 
      onTimeUpdate={onTimeUpdate} 
    />
  );
};

export const AudioPlayer = React.forwardRef(AudioPlayerComponent);
