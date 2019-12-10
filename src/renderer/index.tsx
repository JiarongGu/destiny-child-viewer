import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { SinkFactory } from 'redux-sink';
import { Router } from 'react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import { App } from './app';
import { createNavigationHistory } from '@sinks/navigation/navigation-sink';
import { Character } from '@containers';

import 'antd/dist/antd.css';
import { GameData } from '@containers/game-data/game-data';

const store = SinkFactory.createStore({
  useTrigger: true,
  devToolOptions: { devToolCompose: composeWithDevTools }
});

const history = createNavigationHistory([
  {
    key: 'character',
    name: 'Character',
    icon: 'user',
    link: '/character',
    props: {
      path: '/character',
      component: Character
    }
  },
  {
    key: 'game-data',
    name: 'Game Data',
    icon: 'database',
    link: '/game-data',
    props: {
      path: '/game-data',
      component: GameData
    }
  }
]);

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
