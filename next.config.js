/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      [
        require('rehype-autolink-headings'),
        {
          behavior: 'wrap',
          className: ['anchor'],
        },
      ],
      [require('rehype-prism-plus'), { showLineNumbers: true }],
    ],
    providerImportSource: '@mdx-js/react',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack(config, { isServer }) {
    // SVGR configuration
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                ],
              },
            },
          },
        ],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  // Remove standalone output for better static generation
}

module.exports = withMDX(nextConfig);