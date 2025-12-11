module.exports = {
    apps: [
        {
            name: 'server-monitor',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
        },
    ],
};
