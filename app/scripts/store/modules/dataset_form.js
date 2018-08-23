import API from 'services/ApiManager';
import {
  SET_DATASET_FORM_ID, SET_DATASET_FORM
} from '../mutation-types';

const dataset = {
  state: {
    datasetId: '',
    dataset: null
  },
  mutations: {
    [SET_DATASET_FORM_ID](state, payload) {
      state.datasetId = payload.id;
    },
    [SET_DATASET_FORM](state, payload) {
      state.dataset = payload;
    },
  },
  actions: {
    async getDataset({ commit }, datasetId) {
      const result = await API.get(`dataset/${datasetId}`, 'includes=metadata,vocabulary');
      commit(SET_DATASET_FORM, result.data);
      commit(SET_DATASET_FORM_ID, result.data.id);
    }
  },
  getters: {
    getDatasetId(state) {
      return state.datasetId;
    },
    getDataset(state) {
      return state.dataset;
    },
  }
};

export default dataset;
