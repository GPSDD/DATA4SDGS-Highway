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
    }
  },
  mixins: [JsonMixin],
  mounted() {
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      isOpen: false,
      isTypeOpen: false,
      sandboxIsOpen: false,
      providers: ['csv', 'tsv', 'xml', 'json', 'generic'],
      types: ['rest', 'document', 'wms'],
      showAdvanced: false,
      dataset: {
        connectorType: '',
        provider: '',
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
    }
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
    setProvider(selected) {
      this.dataset.provider = selected;
      this.isOpen = false;
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
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          return;
        }
        const datasetWithEmptyRemoved = this.removeEmptyKeys(this.dataset);
        API.post('dataset', datasetWithEmptyRemoved, this.token).then((result) => {
          console.log(result);
          this.setDatasetId(result.data);
          this.nextTab();
        }).catch((error) => {
          console.error(error);
        });
      });
    },

  },
  watch: {},
  components: {
    router,
    ButtonComponent,
    IconComponent
  },
};

</script>
