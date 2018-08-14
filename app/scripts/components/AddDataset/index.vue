<template src="./add-dataset-template.html"></template>
<style lang="scss" src="./add-dataset-style.scss"></style>
<script>
import router from 'router';
import { mapGetters, mapMutations } from 'vuex';
import SpinnerComponent from 'components/Spinner';
import ButtonComponent from 'components/Button';
import SubPageHeroComponent from 'components/SubPageHero';
import DatasetFormComponent from 'components/DatasetForm';
import MetadataFormComponent from 'components/MetadataForm';
import TagFormComponent from 'components/TagForm';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';
import {
  SET_TOKEN
} from '../../store/mutation-types';

export default {
  name: 'add-dataset-component',
  async created() {
    await this.$store.dispatch('setToken');
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      tabs: [
        {
          name: 'Token',
          active: true
        },
        {
          name: 'Dataset',
          active: false
        },
        {
          name: 'Metadata',
          active: false
        },
        {
          name: 'Tags',
          active: false
        },
      ],
      modelToken: '',
      message: ''
    };
  },
  computed: {
    ...mapGetters({
      token: 'getToken',
      datasetId: 'getDatasetId'
    }),
    showJsonDataFields() {
      return this.provider === 'json' && this.connectorUrl.length === 0;
    }
  },
  methods: {
    ...mapMutations({
      setToken: SET_TOKEN
    }),
    setActiveTab(tab) {
      let index = this.tabs.findIndex(x => x.name === tab.name);
      index = this.checkTabSecurity(index);
      this.deactivateTabs();
      this.tabs[index].active = true;
    },
    deactivateTabs() {
      this.tabs.forEach((x) => { x.active = false; });
    },
    goToPlayground() {
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },

    nextTab() {
      this.message = '';
      let index = this.tabs.findIndex(x => x.active);
      this.deactivateTabs();
      index += 1;
      index = this.checkTabSecurity(index);
      this.tabs[index].active = true;
    },
    saveToken() {
      this.setToken({ token: this.modelToken });
      this.nextTab();
    },
    // returns user to valid tab with message if token unavailable or dataset id not available.
    checkTabSecurity(index) {
      if (index === 0) return index;
      if (!this.token || this.token.length === 0) {
        this.message = 'Please add token prior to creating new dataset.';
        return 0;
      }
      // if we are at on the last two tabs - we need a valid dataset id
      if (index > 1 && (!this.datasetId || this.datasetId.length === 0)) {
        this.message = 'Please create a dataset prior to accessing this tab.';
        return 1;
      }
      return index;
    },
  },
  watch: {},
  components: {
    router,
    ButtonComponent,
    SpinnerComponent,
    SubPageHeroComponent,
    IconComponent,
    DatasetFormComponent,
    MetadataFormComponent,
    TagFormComponent
  },
};

</script>
