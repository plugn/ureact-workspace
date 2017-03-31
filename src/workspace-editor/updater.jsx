import {createReducer} from 'redux-create-reducer';
import Project from '../models/project';

const SET_PROJECT = 'udacity/workspace-editor/set-project';

const devProject = new Project({
  id: 'p-1234',
  workspaceId: 'w-23428347',
  master: {
    kind: 'react',
    conf: {
      openFiles: ['/home/workspace/index.html'],
      previewFile: '/home/workspace/index.html'
    }
  }
});

export const initialState = {
  project: devProject
};

export function getProject(state) {
  return state.project;
}

export function setProject(project) {
  return {
    type: SET_PROJECT,
    project
  };
}

const reducer = createReducer(initialState, {
  [SET_PROJECT](state, {project}) {
    return {...state, project};
  }
});

export default reducer;

export function* saga() {

}
