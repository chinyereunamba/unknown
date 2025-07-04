export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "WebWhisper ",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Get started",
      href: "/login",
    },
  ],
  links: {
    github: "https://github.com/chinyereunamba/",
    login: "/login",
  },
};
