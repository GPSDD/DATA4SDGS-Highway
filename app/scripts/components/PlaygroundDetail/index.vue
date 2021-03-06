<template src="./playground-detail-template.html" ></template >
<style lang="scss" src="./playground-detail-style.scss" ></style >
<script>
  import store from 'store';
  import { mapGetters } from 'vuex';
  import findLast from 'lodash/findLast';
  import ArticleComponent from 'components/Article';
  import ConsoleComponent from 'components/Console';
  import ButtonComponent from 'components/Button';
  import IconComponent from 'components/Icon';
  import DatasetComponent from 'components/Dataset';
  import SpinnerComponent from 'components/Spinner';

  const isSelectedDatasetShallow = (dataset) => {
    if (!dataset) return false;
    return ['worldbank', 'hdx', 'genericindex', 'resourcewatch', 'un'].includes(dataset.provider);
  };

  export default {
    name: 'playground-detail-component',
    beforeRouteEnter(to, from, next) {
      if (to.params.dataset) {
        store.dispatch('setSelectedDataset', to.params.dataset);
      }
      next();
    },
    created() {
      window.addEventListener('scroll', this.handleScroll);
    },
    async mounted() {
      if (
        this.showCodeExamples &&
        this.metadata &&
        Object.keys(this.metadata.info).length > 0 &&
        this.$refs.metadataInfo
      ) {
        hljs.highlightBlock(this.$refs.metadataInfo);
      }
    },
    updated() {
      if (
        this.showCodeExamples &&
        this.metadata &&
        Object.keys(this.metadata.info).length > 0 &&
        this.$refs.metadataInfo
      ) {
        hljs.highlightBlock(this.$refs.metadataInfo);
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    data() {
      const header = document.getElementById('header');
      return {
        fixSidebar: !!header && window.pageYOffset >= header.offsetHeight,
        activeAnchor: 'about',
        showDataWorld: true,
        loginLink: `http://api.apihighways.org/auth/login?callbackUrl=${window.location.origin}/token&token=true`
      };
    },
    computed: {
      dataWorldUrl() {
        return this.selectedDataset ? `https://data.world/gpsdd/${this.selectedDataset.id}` : '';
      },
      showCustomLicenseInfo() {
        return this.metadata && this.metadata.info && Object.keys(this.metadata.info).length > 0 && this.metadata.info.license && Object.keys(this.metadata.info.license).length > 0 && this.metadata.license.toLowerCase() === 'other';
      },
      metadata() {
        if (this.selectedDataset && this.selectedDataset.metadata.length > 0) {
          return this.selectedDataset.metadata[0].attributes;
        }
        return null;
      },
      vocabulary() {
        if (this.selectedDataset && this.selectedDataset.vocabulary.length > 0) {
          return this.selectedDataset.vocabulary[0].attributes;
        }
        return null;
      },
      isCartoDataset() {
        return this.selectedDataset && this.selectedDataset.provider === 'cartodb';
      },
      cartoCsvLink() {
        if (this.isCartoDataset) {
          return this.selectedDataset.connectorUrl;
        }
        return `http://oneclick.cartodb.com/?file=${encodeURIComponent(this.metadata.dataDownloadUrl.csv.replace('select * from ', 'select%20*%20from%20'))}`;
      },
      csvLink() {
        return `https://api.apihighways.org/query?sql=select%20*%20from%20${this.selectedDataset.id}&format=csv`;
      },
      metadataDetails() {
        const details = [];

        const humanFriendlyType = (type) => {
          switch (type) {
            case 'bigquery':
              return 'Big Query';
            case 'gee':
              return 'Google Earth Engine';
            case 'cartodb':
              return 'Carto';
            case 'worldbank':
              return 'World Bank';
            case 'resourcewatch':
              return 'Resource Watch';
            case 'hdx':
              return 'HDX';
            case 'genericindex':
              return 'Generic indexed dataset';
            case 'un':
              return 'UN';
            case 'json':
              return 'JSON Document';
            case 'csv':
              return 'CSV Document';
            default:
              return type;
          }
        };

        if (this.selectedDataset) {
          if (isSelectedDatasetShallow(this.selectedDataset) && this.selectedDataset.provider) {
            details.push({ heading: 'Access API', value: `${humanFriendlyType(this.selectedDataset.provider)} API`, info: true });
          } else {
            details.push({ heading: 'Access API', value: 'API Highways', info: false });
          }

          if (this.selectedDataset.provider) {
            details.push({ heading: 'Dataset type', value: humanFriendlyType(this.selectedDataset.provider) });
          }

          if (this.selectedDataset.id) {
            details.push({ heading: 'Identifier', value: this.selectedDataset.id });
          }
        }

        if (this.metadata) {
          if (this.metadata.sourceOrganization) {
            details.push({ heading: 'Owner / Source', value: this.metadata.sourceOrganization });
          }

          if (this.metadata.dataSourceUrl) {
            details.push({
              heading: 'Data source URL',
              value: `<a href='${this.metadata.dataSourceUrl}' target="_blank" rel="noopener noreferrer">${this.metadata.dataSourceUrl}</a>`
            });
          }

          details.push({ heading: 'Language', value: (this.metadata.language === 'en' ? 'English' : this.metadata.language) });

          if (this.metadata.license && !this.showCustomLicenseInfo) {
            details.push({ heading: 'License', value: this.metadata.license });
          }

          if (this.metadata.license && this.showCustomLicenseInfo) {
            if (this.metadata.info.license.indexOf('http') > -1) {
              details.push({ heading: 'License', value: `<a href="${this.metadata.info.license}" target="_blank">${this.metadata.info.license}</a>` });
            } else {
              details.push({ heading: 'License', value: this.metadata.info.license });
            }
          }

          if (
            this.metadata.dataSourceEndpoint
            && this.metadata.dataSourceEndpoint !== this.metadata.dataSourceUrl
          ) {
            details.push({
              heading: 'Data source endpoint',
              value: `<a href='${this.metadata.dataSourceEndpoint}' target="_blank" rel="noopener noreferrer">${this.metadata.dataSourceEndpoint}</a>`
            });
          }
        }

        if (this.vocabulary) {
          details.push({ heading: 'Tags', value: this.vocabulary.tags.join(', ') });
        }
        return details.filter(detail => detail && (typeof detail.value !== 'undefined'));
      },
      isShallow() {
        return isSelectedDatasetShallow(this.selectedDataset);
      },
      showCodeExamples() {
        return this.selectedDataset && this.selectedDataset.provider !== 'genericindex' && (!this.isShallow || this.selectedDataset.provider === 'resourcewatch');
      },
      showDocsLink() {
        return this.selectedDataset && this.isShallow && this.selectedDataset.provider !== 'resourcewatch';
      },
      loading() {
        return this.$store.state.selectedDataset.selected.loading;
      },
      ...mapGetters({
        selectedDataset: 'getSelectedDataset',
        error: 'getError',
        relatedDatasets: 'getRelatedDatasets'
      })
    },
    methods: {
      dataWorldClick(e) {
        e.preventDefault();
        ga('send', 'event', `Dataworld dataset click event for ${this.selectedDataset.name} dataset`, `Dataworld dataset click event for ${this.selectedDataset.name} dataset`, 'Click');
        window.open(this.dataWorldUrl, '_blank');
      },
      handleScroll() {
        const header = document.getElementById('header');
        const bigPadding = !!(this.showDocsLink && !this.relatedDatasets);
        const paddingOffset = bigPadding ? 160 : 120;
        const examples = [
          { id: 'examples', el: document.getElementById('examples') },
          { id: 'info', el: document.getElementById('info') }
        ];
        const docs = [
          { id: 'docs', el: document.getElementById('docs') }
        ];
        const anchors = [
          { id: 'about', el: document.getElementById('about') },
          ...(this.showCodeExamples ? examples : docs),
          { id: 'related-datasets', el: document.getElementById('related-datasets') }
        ];
        this.fixSidebar = !!header && window.scrollY >= header.offsetHeight;
        const anchor = findLast(
          anchors,
          a => a.el && a.el.offsetTop < (window.scrollY + paddingOffset)
        );
        if (anchor) {
          this.activeAnchor = anchor && anchor.id;
        }
      },
      onRouteChange() {
        this.$store.dispatch('setSelectedDataset', this.$route.params.dataset);
      },
      scrollTo(selector) {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView();
      },
      recordDownload(e, type) {
        e.preventDefault();
        ga('send', 'event', `Download Dataset in ${type} format`, `${this.selectedDataset.name} - dataset type ${this.selectedDataset.provider}`, 'Click');
        window.location = e.target.href;
      },
      recordDataSourceClick(e) {
        e.preventDefault();
        if (e.target.href) {
          ga('send', 'event', 'Data Source URL clicked', `${this.selectedDataset.name} - dataset type ${this.selectedDataset.provider}`, 'Click');
          window.open(e.target.href, '_blank');
        }
      },
      openDocs() {
        ga('send', 'event', 'Open docs click event', `${this.selectedDataset.name} - dataset type ${this.selectedDataset.provider}`, 'Click');
        switch (this.selectedDataset.provider) {
          case 'worldbank':
            window.open('https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information', '_blank');
            break;
          case 'resourcewatch':
            window.open('https://api.resourcewatch.org/', '_blank');
            break;
          case 'hdx':
            window.open('https://data.humdata.org/documentation', '_blank');
            break;
          case 'genericindex':
            window.open(this.selectedDataset.connectorUrl, '_blank');
            break;
          case 'un':
            window.open('https://unstats.un.org/SDGAPI/swagger/', '_blank');
            break;
          default:
            window.open('https://doc.apihighways.org/index.html', '_blank');
            break;
        }
      }
    },
    watch: {
      $route: 'onRouteChange'
    },
    components: {
      ArticleComponent,
      IconComponent,
      ConsoleComponent,
      ButtonComponent,
      DatasetComponent,
      SpinnerComponent
    },
  };

</script >
