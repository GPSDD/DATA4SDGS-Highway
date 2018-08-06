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
      modelToken: ''
    };
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
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
      this.deactivateTabs();
      tab.active = true;
    },
    deactivateTabs() {
      this.tabs.forEach((x) => { x.active = false; });
    },
    goToPlayground() {
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },

    nextTab() {
      let index = this.tabs.findIndex(x => x.active);
      this.deactivateTabs();
      index += 1;
      this.tabs[index].active = true;
    },
    saveToken() {
      this.setToken({ token: this.modelToken });
      this.nextTab();
    }
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
