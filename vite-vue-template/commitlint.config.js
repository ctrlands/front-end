module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['fix', 'refactor', 'docs', 'feature', 'style', 'revert', 'test']],
    // 'type-case': [2, 'always', 'pascal-case'],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'references-empty': [2, 'never'], // 必须包含JIRA号
    'body-leading-blank': [2, 'always'], // body上面必须有空行
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['PAIAS-'],
    },
  },
};
