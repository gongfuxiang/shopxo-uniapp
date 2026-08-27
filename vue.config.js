module.exports = {
    // webpack配置
    configureWebpack: {
        // 关闭 webpack 的性能提示
        performance: {
            hints: false
        }
    },
    // H5 本地开发可选代理（request_url 已用 https 时直连即可，服务端支持 CORS）
    devServer: {
        proxy: [
            {
                context: (pathname) => pathname === '/api.php' || pathname === '/index.php',
                target: 'https://new.shopxo.vip',
                changeOrigin: true,
                secure: true,
            },
        ],
    },
};
