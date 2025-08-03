/** @type {import('next').NextConfig} */
const nextConfig = {eslint: {
    ignoreDuringBuilds: true, // if you had this
  },
  
  // Add this images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },};

export default nextConfig;