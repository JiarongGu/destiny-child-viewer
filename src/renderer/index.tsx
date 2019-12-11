import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { SinkFactory } from 'redux-sink';
import { Router } from 'react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import { App } from './app';
import { createNavigationHistory } from '@sinks/navigation/navigation-sink';
import { loadWindowSink } from '@sinks/window/window-sink';
import { characterRoute, databaseRoute } from '@containers';

import 'antd/dist/antd.css';

const store = SinkFactory.createStore({
  useTrigger: true,
  devToolOptions: { devToolCompose: composeWithDevTools }
});

const history = createNavigationHistory([characterRoute, databaseRoute]);

// load sinks
loadWindowSink(window);

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
