<template src="./metadata-form-template.html"></template>
<style lang="scss" src="./metadata-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';
import API from 'services/ApiManager';
import JsonMixin from 'mixins/json-helper.mixin';

export default {
  name: 'metadata-form-component',
  props: {
    nextTab: {
      type: Function,
      required: true,
    }
  },
  mixins: [JsonMixin],
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      metadata: {
        application: ['data4sdgs'],
        language: 'en',
        name: 'name',
        sourceOrganization: '',
        sourceUrl: '',
        dataDownloadUrl: '',
        dataSourceEndpoint: '',
        license: '',
        info: '',
        units: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      datasetId: 'getDatasetId',
      token: 'getToken'
    })
  },
  methods: {
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    saveMetadata() {
      console.log('dataset id', this.datasetId);
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          window.scrollTo(0, 0);
          return;
        }
        const metadataWithEmptyRemoved = this.removeEmptyKeys(this.metadata);
        API.post(`dataset/${this.datasetId}/metadata`, metadataWithEmptyRemoved, this.token).then((result) => {
          console.log(result);
          this.nextTab();
        }).catch((error) => {
          console.error(error);
        });
      });
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
