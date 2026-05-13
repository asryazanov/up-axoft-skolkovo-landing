const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/up-axoft-skolkovo-landing";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  output: "export",
  basePath: isGitHubPages ? repoBasePath : "",
  assetPrefix: isGitHubPages ? `${repoBasePath}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
