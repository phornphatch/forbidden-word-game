/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    roundDurationInMin: parseInt(process.env.NEXT_PUPLIC_ROUND_DURATION_IN_MIN) || 3
  }
}

module.exports = nextConfig
