// import * as ActionType from '../actions/calendar';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
});

export default function (state = defaultState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
