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
    },
    editDataset: {
      type: Object,
      required: false
    }
  },
  mixins: [JsonMixin],
  directives: {
    clickOutside: vClickOutside.directive
  },
  created() {
    if (this.editDataset) {
      this.metadata = (this.editDataset.attributes.metadata &&
        this.editDataset.attributes.metadata.length > 0)
        ? this.editDataset.attributes.metadata[0].attributes : this.editDataset.attributes.metadata;
      this.provider = this.editDataset.attributes.provider;
      this.metadata.info = JSON.stringify(this.metadata.info);
    }
  },
  data() {
    return {
      licenses: ['Public Domain', 'Attribution', 'Share-alike', 'Non-commercial', 'Database Only', 'No Derivatives', 'Other'],
      isOpen: false,
      metadata: {
        application: ['data4sdgs'],
        language: 'en',
        name: 'name',
        sourceOrganization: '',
        sourceUrl: '',
        dataDownloadUrl: '',
        dataSourceEndpoint: '',
        license: '',
        showResponseError: false,
        info: '',
        units: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      datasetId: 'getDatasetId',
      token: 'getToken'
    }),
    licensePlaceholder() {
      return this.metadata.license.length > 0 ? this.metadata.license : 'License';
    },

  },
  methods: {
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    onClickOutside() {
      this.isOpen = false;
    },
    setLicense(selected) {
      this.metadata.license = selected;
      this.isOpen = false;
    },

    saveMetadata() {
      if (this.editDataset) {
        this.updateMetadata();
        return;
      }
      this.showResponseError = false;
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          window.scrollTo(0, 0);
          return;
        }
        if (this.metadata.info.length > 0) {
          this.metadata.info = JSON.parse(this.metadata.info);
        }
        const metadataWithEmptyRemoved = this.removeEmptyKeys(this.metadata);
        API.post(`dataset/${this.datasetId}/metadata`, metadataWithEmptyRemoved, this.token).then(() => {
          this.nextTab();
        }).catch((error) => {
          this.showResponseError = true;
          console.error(error);
        });
      });
    },
    updateMetadata() {
      this.showResponseError = false;
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          window.scrollTo(0, 0);
          return;
        }
        if (this.metadata.info.length > 0) {
          this.metadata.info = JSON.parse(this.metadata.info);
        }
        const metadataWithEmptyRemoved = this.removeEmptyKeys(this.metadata);
        API.patch(`dataset/${this.editDataset.id}/metadata`, metadataWithEmptyRemoved, this.token).then(() => {
          this.nextTab();
        }).catch((error) => {
          this.showResponseError = true;
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
