<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script>
  import ButtonComponent from 'components/Button';
  import DatasetListComponent from 'components/DatasetList';
  import store from 'store';
  import { mapState } from 'vuex';
  import API from 'services/ApiManager';

  export default {
    name: 'token-page',
    components: {
      ButtonComponent, DatasetListComponent
    },
    data() {
      return {
        datasets: [],
        pageNum: 1
      };
    },
    mounted() {
      this.getUserDatasets();
    },
    computed: {
      ...mapState({
        token: state => state.token.token,
      }),
    },
    methods: {
      selectAll() {
        document.getElementById('token').select();
      },
      getToken() {
        store.dispatch('setToken');
        this.selectAll();
      },
      datasetLink(dataset) {
        return `/data-sets/${dataset.id}`;
      },
      datasetEditLink(dataset) {
        return `/data-sets/${dataset.id}/edit?token=${this.$route.query.token}`;
      },
      async getUserDatasets() {
        const user = await API.getWithAuth('auth/check-logged', null, this.$route.query.token);
        if (user && user.id) {
          const response = await API.get('dataset', `userId=${user.id}&includes=metadata&page[number]=${this.pageNum}`);
          if (this.pageNum === 1) {
            this.datasets = response.data.map(x => Object.assign(x, x.attributes));
          } else {
            this.datasets = this.datasets.concat(response.data.map(
                x => Object.assign(x, x.attributes)));
          }
        }
      },
      loadMore() {
        this.pageNum += 1;
        this.getUserDatasets();
      }
    }
  };
</script>
