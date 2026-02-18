module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-hostname.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};