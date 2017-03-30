import PythonMaster from './python/index';
import ReactMaster from './react/index';

export default {
  [PythonMaster.kind()]: PythonMaster,
  [ReactMaster.kind()]: ReactMaster
};
