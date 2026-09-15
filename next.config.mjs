/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway's Dockerfile sets NEXT_OUTPUT=standalone; Vercel keeps the default output.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
