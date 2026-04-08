import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Permite todas las rutas de Cloudinary
      },
    ],
  },

  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  reactCompiler: true,
};

export default nextConfig;
