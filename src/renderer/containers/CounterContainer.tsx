import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as React from 'react';

import Counter from '../components/Counter';
import { RootState } from '../reducers';
import { CounterAction, decrement, increment } from '../actions/counterActions';
import * as styles from './counter-container.module.scss';

const mapStateToProps = (state: RootState) => ({
  value: state.counter.value
});

const mapDispatchToProps = (dispatch: Dispatch<CounterAction>) => ({
  incrementValue: () => dispatch(increment()),
  decrementValue: () => dispatch(decrement())
});

const Component = props => (
  <div className={styles.container}>
    <Counter {...props} />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Component);
