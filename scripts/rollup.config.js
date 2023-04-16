const generate = require('videojs-generate-rollup-config');
const replace = require('./rollup-replace');
const exampleResolver = require('./rollup-example-resolver');

// see https://github.com/videojs/videojs-generate-rollup-config
// for options
const options = {
  primedPlugins(defaults) {
    return Object.assign(defaults, {exampleResolver,replace});
  },
  plugins(defaults) {
    defaults.module.unshift('exampleResolver')
    
    // add replace just after json for each build
    Object.keys(defaults).forEach((type) => {
      defaults[type].splice(defaults[type].indexOf('json') + 1, '0', 'replace');
    });

    return defaults;
  },
  globals(defaults) {
    return {
      browser: Object.assign(defaults.browser, {
        plyr: 'Plyr'
      }),
      module: Object.assign(defaults.module, {
        plyr: 'Plyr'
      }),
      test: Object.assign(defaults.test, {
        plyr: 'Plyr'
      })
    };
  }
};
const config = generate(options);

// Add additional builds/customization here!

// export the builds to rollup
export default Object.values(config.builds);
