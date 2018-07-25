<template src="./sub-page-hero-template.html"> </template>

<style lang="scss" src="./sub-page-hero-style.scss"> </style>

<script>
export default{
  name: 'sub-page-hero-component',
  props: {
    header: {
      type: String,
      required: true
    },
    backLinkUrl: {
      type: String,
      required: true
    },
    backLinkText: {
      type: String,
      required: true
    }

  },
  computed: {
    heading() {
      return this.header;
    },
    backUrl() {
      return this.backLinkUrl;
    },
    backText() {
      return this.backLinkText;
    }
  },
  data() {
    return {};
  },
};
</script>
