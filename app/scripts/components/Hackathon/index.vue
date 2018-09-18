<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script>

  export default {
    name: 'hackathon-markdown-component',
    components: {
    },
    mounted() {
      fetch('https://raw.githubusercontent.com/GPSDD/Hackathons-and-Challenges/master/Sierra_Leone_Sept_2018/Datasets.md')
        .then(response => response.text())
        .then((result) => { this.markdownText = result; });
    },
    data() {
      return {
        markdownText: ''
      };
    }
  };
</script>
