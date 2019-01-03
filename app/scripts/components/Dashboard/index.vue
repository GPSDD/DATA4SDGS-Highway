<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script>
  import { mapGetters } from 'vuex';
  import IconComponent from 'components/Icon';

  const handleResponse = (d) => {
    if (d.status >= 200 && d.status <= 300) {
      let data;
      try {
        data = d.json();
      } catch (e) {
        data = d.text();
      }
      return data;
    }
    throw new Error(d.statusText);
  };

  const groupBy = (list, props) => list.reduce((a, b) => {
    (a[b.attributes[props]] = a[b.attributes[props]] || []).push(b);
    return a;
  }, {});
  

  export default {
    name: 'admin-dashboard-component',
    components: {
      IconComponent
    },
    ...mapGetters({
      // token: 'getToken'
    }),

    mounted() {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNzFjZGQzYTYwZTFkNTdmZjVlNzRhYSIsInJvbGUiOiJBRE1JTiIsInByb3ZpZGVyIjoibG9jYWwiLCJlbWFpbCI6ImFwaWhpZ2h3YXlzQGRhdGE0c2Rncy5vcmciLCJleHRyYVVzZXJEYXRhIjp7ImFwcHMiOlsiZGF0YTRzZGdzIl19LCJjcmVhdGVkQXQiOjE1NDA1OTI4NjIyNjYsImlhdCI6MTU0MDU5Mjg2Mn0.S92xKfgEpLihnB-QGEuoSk8Vc2i0An42QEkpmsB1sJQ';
      const reqOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          client: 'front'
        }
      };
      // API.get('metadata?&page[size]=10000&page[number]=1').then((result) => {
      //   console.log(result);
      // });
      fetch('https://api.apihighways.org/dataset?provider=worldbank&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.worldBankCount = result.data.length;
        this.worldBankLastRan = this.formatDate(new Date(result.data[0].attributes.updatedAt));
      });
      fetch('https://api.apihighways.org/dataset?provider=un&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.unCount = result.data.length;
        this.unLastRan = this.formatDate(new Date(result.data[0].attributes.updatedAt));
      });
      fetch('https://api.apihighways.org/dataset?provider=hdx&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.hdxCount = result.data.length;
        this.hdxLastRan = this.formatDate(new Date(result.data[0].attributes.updatedAt));
      });
      fetch('https://api.apihighways.org/dataset?provider=resourcewatch&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.resourceWatchCount = result.data.length;
        this.resourceWatchLastRan = this.formatDate(new Date(result.data[0].attributes.updatedAt));
      });
      fetch('https://api.apihighways.org/dataset?vocabulary[legacy]=hdx-full&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        const datasets = groupBy(result.data, 'name'); // we need to groupby because when deleting, vocabulary doesn't always get deleted, and thus appears here
        console.log(datasets);
        this.hdxFullCount = Object.keys(datasets).length;
        this.hdxFullLastRan = this.formatDate(new Date(
          datasets[Object.keys(datasets)[0]][0].attributes.updatedAt));
        this.hdxFullDatasets = datasets;
      });
      fetch('https://api.apihighways.org/dataset?provider=worldbank&status=failed&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.failedWorldBankCount = result.data.length;
        this.failedGroupByWorldBank = groupBy(result.data, 'errorMessage');
      });
      fetch('https://api.apihighways.org/dataset?provider=un&status=failed&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.failedUnCount = result.data.length;
        this.failedGroupByUn = groupBy(result.data, 'errorMessage');
      });
      fetch('https://api.apihighways.org/dataset?provider=hdx&status=failed&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.failedHdxCount = result.data.length;
        this.failedGroupByHdx = groupBy(result.data, 'errorMessage');
      });
      fetch('https://api.apihighways.org/dataset?provider=resourcewatch&status=failed&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.failedResourceWatchCount = result.data.length;
        this.failedGroupByResourceWatch = groupBy(result.data, 'errorMessage');
      });
      fetch('https://api.apihighways.org/dataset?vocabulary[legacy]=hdx-full&status=failed&page[size]=10000', reqOptions).then(handleResponse).then((result) => {
        this.failedHdxCount = result.data.length;
        this.failedGroupByHdx = groupBy(result.data, 'errorMessage');
      });
    },
    data() {
      return {
        worldBankCount: -1,
        unCount: -1,
        hdxCount: -1,
        resourceWatchCount: -1,
        hdxFullCount: -1,
        failedWorldBankCount: -1,
        failedUnCount: -1,
        failedHdxCount: -1,
        failedHdxFullCount: -1,
        failedResourceWatchCount: -1,
        worldBanklastRan: -1,
        unLastRan: -1,
        hdxLastRan: -1,
        hdxFullLastRan: -1,
        resourceWatchLastRan: -1,
        failedGroupByWorldBank: [],
        failedGroupByUn: [],
        failedGroupByHdx: [],
        failedGroupByHdxFull: [],
        failedGroupByResourceWatch: [],
        hdxFullDatasets: []
      };
    },
    methods: {
      formatDate(d) {
        return `${d.getMonth() + 1}/${d.getDate() + 1}/${d.getYear() + 1900}`;
      }
    }
  };
</script>
