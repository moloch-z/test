const typesConfig = require('cz-conventional-changelog-zh/src/types.json');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['release', ...Object.keys(typesConfig)]]
  }
}
