<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script>
  const repositoryUrl = 'https://raw.githubusercontent.com/GPSDD/Hackathons-and-Challenges/master/Projects/';
  export default {
    name: 'communities-markdown-component',
    components: {
    },
    mounted() {
      if (Object.keys(this.$route.params).length === 0) {
        this.isLandingPage = true;
        fetch(`${repositoryUrl}introduction.md`)
          .then(response => response.text())
          .then((result) => { this.markdownText = result; });
      } else {
        fetch(`${repositoryUrl}${this.$route.params.project}/${this.$route.params.project}.md`)
          .then(response => response.text())
          .then((result) => { this.markdownText = result; });
      }
    },
    data() {
      return {
        markdownText: '',
        isLandingPage: false
      };
    }
  };
</script>
