/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // Generates /out folder for static hosting
  trailingSlash: true,     // Ensures proper routing on GitHub Pages
  images: { unoptimized: true }, // Required for static export (no Next.js image server)
  // No basePath needed because mhassanmithun.com is a root custom domain
}

module.exports = nextConfig
