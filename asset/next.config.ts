/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Keep your existing pattern for grok.com (removed the duplicate)
      {
        protocol: "https",
        hostname: "assets.grok.com",
        port: "", // Optional
        pathname: "/**", // Allow all paths under this domain
      },
      // Add the new pattern for cloudinary.com
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Optional
        pathname: "/**", // Allow all paths under this domain
      },
    ],
  },
  // Keeping your experimental config
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allows uploads up to 10MB
    },
  },
};

export default nextConfig;
