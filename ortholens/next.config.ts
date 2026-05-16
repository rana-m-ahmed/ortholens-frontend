import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rana-m-ahmed-ortholens-backend.hf.space',
      },
    ],
  },
}

export default nextConfig
