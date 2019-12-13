import { sink, state, SinkFactory } from 'redux-sink';
import * as _ from 'lodash';

@sink('window')
export class WindowSink {
  @state public size!: { height: number; width: number; minSide: number };

  public static load = (window: Window) => {
    const windowSink = SinkFactory.getSink(WindowSink);
    const setWindowSize = _.debounce(() => {
      const minSide = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
      windowSink.size = {
        minSide,
        height: window.innerHeight,
        width: window.innerWidth
      };
    }, 100);

    window.addEventListener('resize', () => {
      setWindowSize();
    });
    setWindowSize();
  };
}