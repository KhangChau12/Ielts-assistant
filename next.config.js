/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Enable trailing slash for better SEO
  trailingSlash: false,
  // Optimize for production
  poweredByHeader: false,
  // Compress responses
  compress: true,
}

module.exports = nextConfig
