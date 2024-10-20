/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  runtimeCaching,
  skipWaiting: false,
  reloadOnOnline: false,
});

const nextConfig = {};

module.exports = withPWA(nextConfig);
