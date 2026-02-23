/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  // Ensure GSAP works properly in server-side rendering
  transpilePackages: ['gsap'],
};

module.exports = nextConfig;
