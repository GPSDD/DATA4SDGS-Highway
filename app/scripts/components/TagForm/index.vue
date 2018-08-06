<template src="./tag-form-template.html"></template>
<style lang="scss" src="./tag-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import IconComponent from 'components/Icon';
import JsonMixin from 'mixins/json-helper.mixin';
import API from 'services/ApiManager';

export default {
  name: 'tag-form-component',
  data() {
    return {
      vocabulary: '',
      tags: [{ value: '' }],
    };
  },
  mixins: [JsonMixin],
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
    addTag() {
      this.tags.push({ value: '' });
    },
    saveTags() {
      this.$validator.validate().then((isValid) => {
        if (!isValid) {
          window.scrollTo(0, 0);
          return;
        }
        const tagsWithEmptyRemoved = this.removeEmptyArrayItems(this.tags);
        // old vocab tags
        API.post(`dataset/${this.datasetId}/vocabulary/${this.vocabulary}`, { tags: tagsWithEmptyRemoved }, this.token).then(() => {
          // graph tags
          API.post(`dataset/${this.datasetId}/vocabulary/knowledge_graph`, { tags: tagsWithEmptyRemoved }, this.token).then(() => {
            // send email
            this.$router.push(`/data-sets/${this.datasetId}`);
          }).catch((error) => {
            console.error(error);
          });

          this.$router.push(`/data-sets/${this.datasetId}`);
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
