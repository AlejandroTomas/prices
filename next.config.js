/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/",
});

const nextConfig = {
  reactStrictMode: false,
};

module.exports = withPWA(nextConfig);
