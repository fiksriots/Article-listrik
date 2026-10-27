/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{
      source: '/',
      has: [{type:'host',value:'article.fikss.site'}],
      destination: 'https://fikss.site/belajar',
      permanent: true,
    }, {
      source: '/',
      has: [{type:'host',value:'listrik.fikss.site'}],
      destination: 'https://fikss.site/belajar',
      permanent: true,
    }, {
      source: '/jaringan/mikrotik-winbox/:topic',
      destination: '/jaringan/winbox/:topic',
      permanent: true,
    }, {
      source: '/:path*',
      has: [{ type: 'host', value: 'listrik.fikss.site' }],
      destination: 'https://fikss.site/:path*',
      permanent: true,
    }];
  },
};
export default nextConfig;
