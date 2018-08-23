<template src="./dataset-form-template.html"></template>
<style lang="scss" src="./dataset-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters, mapMutations } from 'vuex';
import ButtonComponent from 'components/Button';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';
import API from 'services/ApiManager';
import JsonMixin from 'mixins/json-helper.mixin';
import {
  SET_DATASET_FORM_ID
} from '../../store/mutation-types';

export default {
  name: 'dataset-form-component',
  props: {
    nextTab: {
      type: Function,
      required: true,
    },
    editDataset: {
      type: Object,
      required: false
    }
  },
  mixins: [JsonMixin],
  created() {
    if (this.editDataset) {
      this.dataset = this.editDataset.attributes;
      this.provider = this.editDataset.attributes.provider;
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      isOpen: false,
      isTypeOpen: false,
      sandboxIsOpen: false,
      providers: [{ name: 'csv', value: 'csv' }, { name: 'tsv', value: 'tsv' }, { name: 'xml', value: 'xml' }, { name: 'json', value: 'json' }, { name: 'generic', value: 'genericindex' }],
      provider: '',
      types: ['rest', 'document', 'wms'],
      showAdvanced: false,
      showResponseError: false,
      dataset: {
        connectorType: '',
        provider: { name: '' },
        connectorUrl: '',
        dataPath: '',
        application: ['data4sdgs'],
        sandbox: '',
        dataAttributes: '',
        published: false,
        jsonData: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    }),
    showJsonDataFields() {
      return this.provider === 'json' && this.connectorUrl.length === 0;
    },
    providerPlaceholder() {
      return this.provider.length > 0 ? this.provider : 'Set Dataset Provider';
    },
    sandboxPlaceholder() {
      return this.dataset.sandbox.length > 0 ? this.dataset.sandbox : 'Is Sandbox Dataset';
    },

  },
  methods: {
    ...mapMutations({
      setDatasetId: SET_DATASET_FORM_ID
    }),
    onClickOutside() {
      this.isOpen = false;
    },
    onSandboxClickOutside() {
      this.sandboxIsOpen = false;
    },
    onTypeClickOutside() {
      this.typeIsOpen = false;
    },
    setProvider() {
      const providerItem = this.providers.filter(x => x.value === this.dataset.provider)[0];
      this.provider = providerItem.name;
    },
    setType(selected) {
      this.dataset.connectorType = selected;
      this.isTypeOpen = false;
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    saveDataset() {
      if (this.editDataset) {
        this.updateDataset();
        return;
      }
      this.showResponseError = false;
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          return;
        }
        let datasetWithEmptyRemoved = this.removeEmptyKeys(this.dataset);
        datasetWithEmptyRemoved = this.setDatasetType(datasetWithEmptyRemoved);
        API.post('dataset', datasetWithEmptyRemoved, this.token).then((result) => {
          this.setDatasetId(result.data);
          this.nextTab();
        }).catch((error) => {
          this.showResponseError = true;
          console.error(error);
        });
      });
    },
    updateDataset() {
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          return;
        }
        let datasetWithEmptyRemoved = this.removeEmptyKeys(this.dataset);
        datasetWithEmptyRemoved = this.setDatasetType(datasetWithEmptyRemoved);
        API.patch(`dataset/${this.editDataset.id}`, datasetWithEmptyRemoved, this.token).then(() => {
          this.nextTab();
        }).catch((error) => {
          this.showResponseError = true;
          console.error(error);
        });
      });
    },
    // Sets the connectorType based on the provider.
    // csv, tsv, xml, json = document
    // rest of them = rest
    // update when more providers are added
    setDatasetType(dataset) {
      switch (dataset.provider) {
        case 'genericindex':
          dataset.connectorType = 'rest';
          break;
        default:
          dataset.connectorType = 'document';
          break;
      }
      return dataset;
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
