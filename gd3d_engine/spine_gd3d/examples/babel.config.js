module.exports = api => {
    api.cache(true);
    return {
        "presets": [
            "@babel/react",
            ['@babel/typescript', { allowNamespaces: true }],
            [
                "@babel/env",
                // {
                //     "corejs": "3.0.0",
                //     "useBuiltIns": "usage",
                //     "targets": {
                //         "chrome": "77",
                //     },
                // }
            ],
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-decorators",
                {
                    "legacy": true
                }
            ],
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread",
        ]
    };
};