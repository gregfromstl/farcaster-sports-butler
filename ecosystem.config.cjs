module.exports = {
    apps: [
        {
            name: "sports-butler",
            script: "./dist/app.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
