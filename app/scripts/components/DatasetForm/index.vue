<template src="./dataset-form-template.html"></template>
<style lang="scss" src="./dataset-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';

export default {
  name: 'dataset-form-component',
  created() {
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      isOpen: false,
      overwriteIsOpen: false,
      sandboxIsOpen: false,
      providers: ['csv', 'tsv', 'xml', 'json', 'generic'],
      showAdvanced: false,
      dataset: {
        provider: '',
        connectorUrl: '',
        dataPath: '',
        application: '',
        overwrite: '',
        sandbox: '',
        dataAttributes: '',
        jsonData: ''
      }
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
    onClickOutside() {
      this.isOpen = false;
    },
    onSandboxClickOutside() {
      this.overwriteIsOpen = false;
    },
    onOverwriteClickOutside() {
      this.sandboxIsOpen = false;
    },
    setProvider(selected) {
      this.provider = selected;
      this.isOpen = false;
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    nextTab() {
      this.saveDataset();
    },
    saveDataset() {
      this.tabs[1].active = true;
      console.log('saved dataset');
    }
  },
  watch: {},
  components: {
    router,
    ButtonComponent,
    IconComponent
  },
};

</script>
