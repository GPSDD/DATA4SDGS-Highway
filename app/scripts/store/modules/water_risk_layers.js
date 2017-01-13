import {
  SET_WATER_LAYER_SUCCESS,
  SET_WATER_LAYER_ERROR,
  SET_WATER_LAYER_LOADING,
  SET_WATER_LAYERS_ACTIVE,
  SET_BASINS_SUCCESS,
  SET_BASINS_ERROR,
  SET_BASINS_LOADING
} from '../mutation-types';

export default {
  /*
    INITIAL STATE
  */
  state: {
    layers: {
      list: [],
      active: [],
      loading: false,
      error: null,
    },
    basins: {
      list: [],
      loading: false,
      error: null
    }
  },
  /*
    MUTATIONS
  */
  mutations: {
    [SET_WATER_LAYER_SUCCESS](state, layers) {
      state.layers.list = layers;
      state.layers.loading = false;
      state.layers.error = null;
    },
    [SET_WATER_LAYER_ERROR](state, error) {
      state.layers.error = error;
    },
    [SET_WATER_LAYER_LOADING](state, loading) {
      state.layers.loading = loading;
    },
    [SET_WATER_LAYERS_ACTIVE](state, activeLayers) {
      state.layers.active = activeLayers.slice(0);
    },
    [SET_BASINS_SUCCESS](state, basins) {
      state.basins.list = basins;
      state.basins.loading = false;
      state.basins.error = null;
    },
    [SET_BASINS_ERROR](state, error) {
      state.basins.error = error;
    },
    [SET_BASINS_LOADING](state, loading) {
      state.basins.loading = loading;
    }
  },
  /*
    ACTIONS
  */
  actions: {
    // Fetch layers from api
    getWaterRiskLayers({ commit }) {
      commit(SET_WATER_LAYER_LOADING, true);
      fetch(new Request('http://api.resourcewatch.org/layer?app=sdg'))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((layers) => {
        // Parse data from json-api format
        const ls = [];
        const lsActives = [];
        layers.data.forEach((layer) => {
          ls.push(Object.assign({}, layer.attributes, { id: layer.id }));
          lsActives.push(layer.id);
        });
        // Fetch from server ok -> Commit layers
        commit(SET_WATER_LAYER_SUCCESS, ls);
        commit(SET_WATER_LAYERS_ACTIVE, lsActives);
        commit(SET_WATER_LAYER_LOADING, false);
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        commit(SET_WATER_LAYER_ERROR, err);
        commit(SET_WATER_LAYER_LOADING, false);
      });
    },

    setActiveLayers({ commit }, layers) {
      commit(SET_WATER_LAYERS_ACTIVE, layers);
    },

    getWaterBasins({ commit }) {
      // TODO: this should be a dataset insted of a requests to carto
      const url = `http://simbiotica.carto.com/api/v2/sql?q=with r as (SELECT sum(population) pop, basin_name, basinid,
      sum((transition_types::json->>'3')::numeric*pixel_area/10000) water_area_ha FROM water_basin_sa group by basin_name,
      basinid  order by 4 desc) select round(sum(pop)) as pop, round(sum(water_area_ha)) water,
      basin_name from r where water_area_ha is not null and basin_name != '' group by basin_name order by water desc`;

      commit(SET_BASINS_LOADING, true);
      fetch(new Request(url))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((basins) => {
        commit(SET_BASINS_SUCCESS, basins.rows);
        commit(SET_BASINS_LOADING, false);
      })
      .catch((err) => {
        // Fetch from server ko -> Dispatch error
        commit(SET_BASINS_ERROR, err);
        commit(SET_BASINS_LOADING, false);
      });
    }
  },

  /*
    GETTERS
  */
  getters: {
    getActiveLayers({ layers }) {
      return layers.list.filter(layer => layers.active.includes(layer.id));
    }
  }
};