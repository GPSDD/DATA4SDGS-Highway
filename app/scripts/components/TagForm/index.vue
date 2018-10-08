<template src="./tag-form-template.html"></template>
<style lang="scss" src="./tag-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import IconComponent from 'components/Icon';
import JsonMixin from 'mixins/json-helper.mixin';
import API from 'services/ApiManager';
import vClickOutside from 'v-click-outside';

export default {
  name: 'tag-form-component',
  props: {
    editDataset: {
      type: Object,
      required: false
    }
  },
  created() {
    if (this.editDataset) {
      console.log(this.editDataset.attributes.vocabulary);
      const tags = this.editDataset.attributes.vocabulary[0].attributes ? this.editDataset.attributes.vocabulary[0].attributes.tags : [''];
      this.tags = tags.reduce((tagList, tag) => {
        tagList.push({ value: tag, isOpen: false, filterTags: [], selected: false });
        return tagList;
      }, []);

      this.metadata = (this.editDataset.attributes.metadata &&
        this.editDataset.attributes.metadata.length > 0)
        ? this.editDataset.attributes.metadata[0].attributes : this.editDataset.attributes.metadata;
      this.provider = this.editDataset.attributes.provider;
    }
  },

  data() {
    return {
      tags: [{ value: '', isOpen: false, filterTags: [], selected: false }],
      existingTags: [],
      showResponseError: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  mixins: [JsonMixin],
  computed: {
    ...mapGetters({
      datasetId: 'getDatasetId',
      token: 'getToken'
    })
  },
  async mounted() {
    await API.get('graph/query/list-concepts').then((results) => {
      this.existingTags = results.data.map(tagResult => tagResult.label);
    });
  },
  methods: {
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    addTag() {
      this.tags.push({ value: '', isOpen: false, filterTags: [], selected: false });
    },
    filterTags(tag) {
      tag.filterTags = this.existingTags.filter(x =>
                    x.toLowerCase().indexOf(tag.value.toLowerCase().trim()) > -1);
    },
    openTag(tag) {
      tag.isOpen = true;
    },
    setTag(tag, value) {
      tag.value = value;
      tag.isOpen = false;
    },
    closeTags() {
      this.tags.forEach((tag) => { tag.isOpen = false; });
    },
    saveTags() {
      this.showResponseError = false;
      const tagsWithEmptyRemoved = this.removeEmptyArrayItems(this.tags);

      // if no tags uploaded - no problem. Let's just take them to the dataset page.
      if (!tagsWithEmptyRemoved || tagsWithEmptyRemoved.length === 0) {
        this.$router.push(`/data-sets/${this.datasetId}`);
        return;
      }

      // old vocab tags
      API.post(`dataset/${this.datasetId}/vocabulary`, { legacy: { tags: tagsWithEmptyRemoved } }, this.token).then(() => {
        // graph tags
        API.post(`dataset/${this.datasetId}/vocabulary/knowledge_graph`, { tags: tagsWithEmptyRemoved }, this.token).then(() => {
          // send email
          this.$router.push(`/data-sets/${this.datasetId}`);
        }).catch((error) => {
          this.showResponseError = true;
          console.error(error);
        });
        this.$router.push(`/data-sets/${this.datasetId}`);
      }).catch((error) => {
        this.showResponseError = true;
        console.error(error);
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
