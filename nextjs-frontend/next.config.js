module.exports = {
    future: {
        webpack5: true,
    },
    env: {
        NEXT_PUBLIC_WG_BASE_URL: process.env.NEXT_PUBLIC_WG_BASE_URL || 'http://localhost:9991',
    },
}
