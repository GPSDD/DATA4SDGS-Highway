<template src="./metadata-form-template.html"></template>
<style lang="scss" src="./metadata-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import vClickOutside from 'v-click-outside';
import IconComponent from 'components/Icon';

export default {
  name: 'metadata-form-component',
  created() {
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      metadata: {
        application: '',
        language: '',
        source: '',
        sourceUrl: '',
        sourceEndpoint: '',
        downloadUrl: '',
        license: '',
        info: '',
        units: ''
      }
    };
  },
  computed: {
    ...mapGetters({
    })
  },
  methods: {
    goToPlayground() {
      // Google Analytics
      ga('send', 'event', 'Add Data Set', 'Click Cancel', 'Click');
      this.$router.push('/data-sets');
    },
    saveMetadata() {
      console.log('saved metadata');
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
