module.exports = {
  apps: [
    {
      name: "landing-gym",
      script: "node_modules/vite/bin/vite.js",
      args: "preview --port 3001",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};