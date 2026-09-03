const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const noIndexHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet, noarchive' },
];

const previewHeaders = process.env.VERCEL_ENV === 'production'
  ? []
  : noIndexHeaders;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    useTypeScriptCli: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [...securityHeaders, ...previewHeaders],
      },
      {
        source: '/login',
        headers: noIndexHeaders,
      },
      {
        source: '/admin',
        headers: noIndexHeaders,
      },
      {
        source: '/admin/:path*',
        headers: noIndexHeaders,
      },
      {
        source: '/api/:path*',
        headers: noIndexHeaders,
      },
      {
        source: '/content.json',
        headers: noIndexHeaders,
      },
      {
        source: '/stats.json',
        headers: noIndexHeaders,
      },
      {
        source: '/google1c82e0d7e6c888f0.html',
        headers: noIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
