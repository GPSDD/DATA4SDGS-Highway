<template src="./tag-form-template.html"></template>
<style lang="scss" src="./tag-form-style.scss"></style>
<script>
import router from 'router';
import { mapGetters } from 'vuex';
import ButtonComponent from 'components/Button';
import IconComponent from 'components/Icon';

export default {
  name: 'tag-form-component',
  created() {
  },
  data() {
    return {
      tags: [{ value: '' }]
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
    addTag() {
      this.tags.push({ value: '' });
    },
    nextTab() {
      console.log('saved tag');
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
