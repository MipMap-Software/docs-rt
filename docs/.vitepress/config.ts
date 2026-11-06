import {defineConfig} from "vitepress";
import path from "node:path";
import {fileURLToPath} from "node:url";
import markdownItImageFigures from "markdown-it-image-figures";
import {buildSidebarWithOptions} from "./sidebar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "..");
const vitepressCommand = process.argv.find((arg) => arg === "dev" || arg === "build" || arg === "preview");
const isDev = vitepressCommand === "dev";

type LocaleSpec = {
  label: string;
  lang: string;
  path: string;
  outlineTitle: string;
};

const localeSpecs: Record<string, LocaleSpec> = {
  "zh-Hans": {label: "简体中文", lang: "zh-CN", path: "/zh-Hans/", outlineTitle: "本页导航"},
};

function localeContentRoot(localeKey: string): string {
  return path.join(docsRoot, localeKey);
}

function makeLocaleTheme(pathPrefix: string, localeKey: string) {
  const locale = localeSpecs[localeKey];
  const theme = {
    logo: "/img/mipmap_icon.png",
    nav: [
      {text: "MipMap官网", link: "https://www.mipmap3d.com/"},
      {text: "B站", link: "https://space.bilibili.com/3546666453960858"},
      {
        text: "抖音",
        link: "https://www.douyin.com/user/MS4wLjABAAAACuPHt6LZw97U20dSiqKrVD-H4QlhgsQlNz-Q-4APdbUWop9TdqBpwwBRvMLQfn2-",
      },
    ],
    socialLinks: [],
    search: {
      provider: "local" as const,
    },
    outline: [3, 4] as const,
    outlineTitle: locale.outlineTitle,
    sidebar: buildSidebarWithOptions(localeContentRoot(localeKey), pathPrefix, {}),
    footer: {
      message: "MipMap RT Documentation",
      copyright: `Copyright © ${new Date().getFullYear()} MipMap.`,
    },
  };
  return theme;
}

const locales = Object.fromEntries(
  Object.entries(localeSpecs).map(([localeKey, spec]) => {
    return [
      localeKey,
      {
        label: spec.label,
        lang: spec.lang,
        link: spec.path,
        themeConfig: makeLocaleTheme(spec.path, localeKey),
      },
    ];
  }),
) as Record<string, any>;

export default defineConfig({
  title: "MipMap RT",
  description: "MipMap RT",
  lang: "zh-CN",
  base: isDev ? "/" : "/RT",
  markdown: {
    config(md) {
      md.use(markdownItImageFigures, {
        figcaption: false,
        classes: "block-image",
      });
    },
  },
  themeConfig: {
    search: {
      provider: "local",
    },
  },
  cleanUrls: true,
  lastUpdated: true,
  outDir: "../build",
  locales,
  sitemap: {
    hostname: 'https://docs.mipmap3d.com/RT/'
  }
});
