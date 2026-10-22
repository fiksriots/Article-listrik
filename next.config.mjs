/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{
      source: '/jaringan/mikrotik-winbox/:topic',
      destination: '/jaringan/winbox/:topic',
      permanent: true,
    }, {
      source: '/:path*',
      has: [{ type: 'host', value: 'listrik.fikss.site' }],
      destination: 'https://article.fikss.site/:path*',
      permanent: true,
    }];
  },
};
export default nextConfig;
