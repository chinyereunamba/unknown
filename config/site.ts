export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Summarise ",
  description: "Transform lengthy content into actionable insights",
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
    github: "https://github.com/chinyereunamba/unknown",
    login: "/login",
  },
};
