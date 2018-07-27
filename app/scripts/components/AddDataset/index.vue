<template src="./add-dataset-template.html"></template>
<style lang="scss" src="./add-dataset-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import SpinnerComponent from 'components/Spinner';
import ButtonComponent from 'components/Button';
import SubPageHeroComponent from 'components/SubPageHero';
import DatasetFormComponent from 'components/DatasetForm';
import MetadataFormComponent from 'components/MetadataForm';
import TagFormComponent from 'components/TagForm';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';

export default {
  name: 'add-dataset-component',
  created() {
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      tabs: [
        {
          name: 'Dataset',
          active: true
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
    };
  },
  computed: {
    ...mapGetters({
    }),
    showJsonDataFields() {
      return this.provider === 'json' && this.connectorUrl.length === 0;
    }
  },
  methods: {
    setActiveTab(tab) {
      this.deactivateTabs();
      tab.active = true;
    },
    deactivateTabs() {
      this.tabs.forEach((x) => { x.active = false; });
    },
    nextTab() {
      const index = this.tabs.findIndex(x => x.active);
      this.deactivateTabs();
      switch (index) {
        case 0:
          this.saveDataset();
          break;
        case 1:
          this.saveMetadata();
          break;
        default:
          this.saveTags();
          break;
      }
    },
    saveMetadata() {
      console.log('saved metadata');
      this.tabs[2].active = true;
    },
    saveTags() {
      console.log('saved tags');
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
