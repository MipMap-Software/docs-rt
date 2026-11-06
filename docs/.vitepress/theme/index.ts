import DefaultTheme from "vitepress/theme";
import type {EnhanceAppContext} from "vitepress";
import "./custom.css";

function chineseUrl(href: string): string | null {
  const url = new URL(href, window.location.origin);
  const base = import.meta.env.BASE_URL || "/";
  const basePath = base.endsWith("/") ? base : `${base}/`;
  let path = url.pathname;
  if (basePath !== "/" && path.startsWith(basePath)) {
    path = `/${path.slice(basePath.length)}`;
  }

  let rest: string | null = null;
  if (path === "/" || path === "/en" || path === "/en/") rest = "";
  else if (path.startsWith("/en/")) rest = path.slice("/en/".length);
  if (rest === null) return null;

  return `${basePath}zh-Hans/${rest}${url.search}${url.hash}`;
}

export default {
  extends: DefaultTheme,
  enhanceApp({router}: EnhanceAppContext) {
    if (typeof window === "undefined") return;

    const redirect = (href: string) => {
      const target = chineseUrl(href);
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (!target || target === current) return false;
      window.location.replace(target);
      return true;
    };

    if (redirect(window.location.href)) return;

    router.onBeforeRouteChange = (to) => {
      if (redirect(to)) return false;
    };
    window.addEventListener("popstate", () => {
      redirect(window.location.href);
    });
  },
};
