/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  publicRuntimeConfig: {
    baseURL: process.env.baseURL || 'http://localhost:3000'
  }
}

module.exports = nextConfig