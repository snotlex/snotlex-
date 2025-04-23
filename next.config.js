/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
