/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@vibewell/ui", "@vibewell/utils", "@vibewell/config", "@vibewell/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "http",
        hostname: "localhost"
      }
    ]
  }
};

module.exports = nextConfig;