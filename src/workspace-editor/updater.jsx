import {createReducer} from 'redux-create-reducer';

const SET_PROJECT = 'udacity/workspace-editor/set-project';

export const initialState = {};

export function getProject(state, target) {
  return state[target] && state[target].project;
}

export function setProject(project, target) {
  return {
    type: SET_PROJECT,
    target,
    project
  };
}

const reducer = createReducer(initialState, {
  [SET_PROJECT](state, {project, target}) {
    return {...state, [target]: {...state[target], project}};
  }
});

export default reducer;

export function* saga() {

}
