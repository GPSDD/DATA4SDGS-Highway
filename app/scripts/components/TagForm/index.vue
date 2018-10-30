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
      const tags = this.editDataset.attributes.vocabulary[0].attributes ? this.editDataset.attributes.vocabulary[0].attributes.tags : [''];
      this.editTags = tags.reduce((tagList, tag) => {
        tagList.push({ value: tag, isOpen: false, filterTags: [], selected: false });
        return tagList;
      }, []);

      this.provider = this.editDataset.attributes.provider;
    }
  },

  data() {
    return {
      tags: [{ value: '', isOpen: false, filterTags: [], selected: false }],
      existingTags: [],
      editTags: [],
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
    }),
    currentDataseId() {
      return this.datasetId ? this.datasetId : this.editDataset.id;
    }
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
    deleteTag(tag) {
      this.editTags = this.editTags.filter(x => x.value !== tag.value);
      const tagsWithEmptyRemoved = this.removeEmptyArrayItems(this.editTags);
      this.updateTags(tagsWithEmptyRemoved);
    },
    async updateTags(tags) {
      return new Promise((resolve, reject) => {
        API.delete(`dataset/${this.currentDataseId}/vocabulary/legacy`, this.token).then(() => {
          API.delete(`dataset/${this.currentDataseId}/vocabulary/knowledge_graph`, this.token).then(() => {
            API.post(`dataset/${this.currentDataseId}/vocabulary`, { legacy: { tags } }, this.token).then(() => {
              resolve();
            }).catch(() => { this.showResponseError = true; reject(); });
          }).catch(() => { this.showResponseError = true; reject(); });
        }).catch(() => { this.showResponseError = true; reject(); });
      });
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
    async saveTags() {
      this.showResponseError = false;
      const tagsWithEmptyRemoved = this.removeEmptyArrayItems(this.tags);

      // if no tags uploaded - no problem. Let's just take them to the dataset page.

      if (!tagsWithEmptyRemoved || tagsWithEmptyRemoved.length === 0) {
        this.$router.push(`/data-sets/${this.currentDataseId}`);
        return;
      }
      if (this.editTags && this.editTags.length > 0) {
        let editTagsWithEmptyRemoved = this.removeEmptyArrayItems(this.editTags);
        editTagsWithEmptyRemoved = editTagsWithEmptyRemoved.concat(tagsWithEmptyRemoved);
        await this.updateTags(editTagsWithEmptyRemoved);
        this.$router.push(`/data-sets/${this.currentDataseId}`);
      } else {
        API.post(`dataset/${this.currentDataseId}/vocabulary`, { legacy: { tags: tagsWithEmptyRemoved } }, this.token).then(() => {
          // graph tags
          API.post(`dataset/${this.currentDataseId}/vocabulary/knowledge_graph`, { tags: tagsWithEmptyRemoved }, this.token).then(() => {
            // send email
            this.$router.push(`/data-sets/${this.currentDataseId}`);
          }).catch((error) => {
            this.showResponseError = true;
            console.error(error);
          });
          this.$router.push(`/data-sets/${this.currentDataseId}`);
        }).catch((error) => {
          this.showResponseError = true;
          console.error(error);
        });
      }
      // old vocab tags
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
