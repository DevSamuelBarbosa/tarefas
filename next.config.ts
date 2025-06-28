import type { NextConfig } from "next";
const ambiente = process.env.NEXT_PUBLIC_APP_ENVIRONMENT === 'production'

const nextConfig: NextConfig = {
    devIndicators: false,
    //output: "export",
    images: {
        unoptimized: true,
    },
    basePath: ambiente ? "/tarefas" : '',
    assetPrefix: ambiente ? "/tarefas" : '',
    trailingSlash: true,
};

export default nextConfig;
