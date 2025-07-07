"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { signOut } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "./ui/label";
import { TranslatedText } from "./TranslatedText";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const {data: session} = authClient.useSession()

  const handleSignOut = () => {
    signOut();
    return router.push("/");
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            <p className="font-bold text-inherit">Summarise</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                <TranslatedText>{item.label}</TranslatedText>
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
        </NavbarItem>

        {session ? (
          <NavbarItem className="hidden md:flex">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session?.user?.name || session?.user?.email}
              </span>
              <Button
                className="text-sm font-normal"
                variant="outline"
                onClick={handleSignOut}
              >
                <TranslatedText>Sign Out</TranslatedText>
              </Button>
            </div>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden md:flex">
            <Button asChild className="text-sm font-normal" variant="default">
              <Link href="/login">
                <TranslatedText>Get started</TranslatedText>
              </Link>
            </Button>
          </NavbarItem>
        )}

        <NavbarItem>
          <div className="flex gap-4 items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="flex-1">
                <SelectValue
                  placeholder={<TranslatedText>Language</TranslatedText>}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                <TranslatedText>{item.label}</TranslatedText>
              </Link>
            </NavbarMenuItem>
          ))}

          {session ? (
            <NavbarMenuItem>
              <Button variant="outline" size="lg" onClick={handleSignOut}>
                <TranslatedText>Sign Out</TranslatedText>
              </Button>
            </NavbarMenuItem>
          ) : (
            <NavbarMenuItem>
              <Button asChild size="lg">
                <Link href="/login">
                  <TranslatedText>Get started</TranslatedText>
                </Link>
              </Button>
            </NavbarMenuItem>
          )}

          <NavbarMenuItem>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                <TranslatedText>Language</TranslatedText>
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={<TranslatedText>Language</TranslatedText>}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
