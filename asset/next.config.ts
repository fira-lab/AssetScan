const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.grok.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  webpack: (config: { resolve: { fallback: any; }; }, { isServer }: any) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;