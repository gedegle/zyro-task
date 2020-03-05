module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
    plugins: ['stylelint-order', 'stylelint-scss', 'stylelint-prettier'],
    rules: {
        'at-rule-no-unknown': null,
        'max-nesting-depth': 4,
        'order/properties-alphabetical-order': true,
        'prettier/prettier': true,
        'rule-empty-line-before': [
            'always',
            {
                except: ['after-single-line-comment', 'first-nested']
            }
        ],
        'scss/at-extend-no-missing-placeholder': true,
        'scss/at-rule-no-unknown': true
    },
    syntax: 'scss'
};
