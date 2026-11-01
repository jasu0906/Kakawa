/** @type {import('next').NextConfig} */
const isExport = process.env.KAKAWA_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // `KAKAWA_EXPORT=1 npm run build` genera una versión estática en /out
  // con rutas relativas (útil para previsualizarla en cualquier hosting simple).
  ...(isExport ? { output: "export", assetPrefix: "./", images: { unoptimized: true } } : {}),
};
export default nextConfig;
