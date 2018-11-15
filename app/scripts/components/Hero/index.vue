<template src="./hero-template.html"> </template>
<style lang="scss" src="./hero-style.scss"> </style>
<script>
import ButtonComponent from 'components/Button';
import SearchComponent from 'components/Search';

export default {
  name: 'hero-component',
  data() {
    return {
    };
  },
  components: {
    ButtonComponent,
    SearchComponent
  },
  computed: {
    heroTitle() {
      return this.$route.params.project ? this.$route.params.project : '';
    },
    styles() {
      let classes = 'c-hero';
      if (this.location.home) {
        classes += ' -home';
      }
      return classes;
    },
    location() {
      const computedLocation = {};
      let location = this.$route.path;
      let params = [...Object.values(this.$route.params)];

      params = params.join('/');
      params = params && `/${params}`;
      location = params ? location.split(params)[0] : location;
      location = location.toLowerCase();
      console.log('location');
      console.log(location);
      computedLocation.home = location === '/';
      computedLocation.playground = location === '/data-sets';
      computedLocation.token = location === '/token';
      computedLocation.partners = location === '/partner-apis';
      computedLocation.hackathon = location === '/hackathon';
      computedLocation.dashboard = location === '/dashboard';
      computedLocation.communities = location.indexOf('communities') > -1;
      computedLocation.examples = location === '/examples';
      return computedLocation;
    },
  },
  methods: {
    goToFindOutMore() {
      return false;
    },
  },
};
</script>
