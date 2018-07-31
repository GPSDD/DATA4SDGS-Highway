const JsonMixin = {
  methods: {
    removeEmptyKeys(obj) {
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        if (typeof obj[key] === 'undefined' || obj[key] === null || obj[key].length === 0) {
          delete obj[key];
        }
      });
      return obj;
    },
    removeEmptyArrayItems(array) {
      const noBlanks = array.filter(item => item && item.value && item.value.length > 0)
        .map(item => item.value);
      return noBlanks;
    }
  }
};

export default JsonMixin;
