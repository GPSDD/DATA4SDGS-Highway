import {
  SET_DATASET_FORM_ID,
} from '../mutation-types';

const dataset = {
  state: {
    datasetId: ''
  },
  mutations: {
    [SET_DATASET_FORM_ID](state, payload) {
      state.datasetId = payload.id;
    },
  },
  actions: {
  },
  getters: {
    getDatasetId(state) {
      return state.datasetId;
    },
  }
};

export default dataset;
