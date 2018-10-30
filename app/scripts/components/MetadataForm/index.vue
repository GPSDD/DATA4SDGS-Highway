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
      if (this.editDataset.attributes.metadata && this.editDataset.attributes.metadata.length > 0) {
        this.existingMetadata = true;
        this.metadata = this.editDataset.attributes.metadata[0].attributes;
      }
      this.provider = this.editDataset.attributes.provider;
      this.metadata.info = JSON.stringify(this.metadata.info);
    }
  },
  data() {
    return {
      licenses: [
        { label: 'Public Domain', value: 'CC-0' },
        { label: 'Public Domain Dedication and License', value: 'PDDL' },
        { label: 'Attribution', value: 'CC-BY' },
        { label: 'Share-alike', value: 'CC-BY-SA' },
        { label: 'Non-commercial', value: 'CC BY-NC' },
        { label: 'Open Database License', value: 'ODC-ODbL' },
        { label: 'No Derivatives', value: 'CC BY-ND' },
        { label: 'Other', value: 'Other' }],
      isOpen: false,
      existingMetadata: false,
      metadata: {
        application: ['data4sdgs'],
        language: 'en',
        name: 'name',
        sourceOrganization: '',
        description: '',
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
      return this.metadata.license && this.metadata.license.length > 0 ? this.metadata.license : 'License';
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
      if (this.editDataset && this.existingMetadata) {
        this.updateMetadata();
        return;
      }
      this.showResponseError = false;
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          window.scrollTo(0, 0);
          return;
        }
        const metadataWithEmptyRemoved = this.removeEmptyKeys(this.metadata);
        if (this.metadata.info.length > 0) {
          if (this.metadata.info.indexOf('{') === -1) {
            metadataWithEmptyRemoved.info = { info: this.metadata.info };
          } else {
            metadataWithEmptyRemoved.info = JSON.parse(this.metadata.info);
          }
        }
        const datasetId = this.datasetId ? this.datasetId : this.editDataset.id;
        API.post(`dataset/${datasetId}/metadata`, metadataWithEmptyRemoved, this.token).then(() => {
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
          if (this.metadata.info.indexOf('{') === -1) {
            this.metadata.info = { info: this.metadata.info };
          } else {
            this.metadata.info = JSON.parse(this.metadata.info);
          }
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
