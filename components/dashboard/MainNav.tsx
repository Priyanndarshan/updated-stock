"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/components/ui/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const petZoneItems = [
  {
    title: "Focused Area",
    href: "/pet-zone/focused-area",
    description: "Identify key demand and supply zones for today's trading.",
    icon: <Icons.focusedArea className="h-5 w-5 text-teal-600" />,
  },
  {
    title: "Weekly Goals",
    href: "/pet-zone/weekly-goals",
    description: "Set and track your weekly trading goals and objectives.",
    icon: <Icons.weeklyGoals className="h-5 w-5 text-teal-600" />,
  },
  {
    title: "Trade Setup",
    href: "/pet-zone/trade-setup",
    description: "Configure your trading environment and strategy parameters.",
    icon: <Icons.tradeSetup className="h-5 w-5 text-teal-600" />,
  },
]

const videoItems = [
  {
    title: "Live Sessions",
    href: "/videos/live-sessions",
    description: "Join our live trading sessions and market analysis.",
    icon: <Icons.videos className="h-5 w-5 text-teal-600" />,
  },
  {
    title: "Trade Align Setup",
    href: "/videos/trade-align-setup",
    description: "Learn how to align your trades with market conditions.",
    icon: <Icons.tradeSetup className="h-5 w-5 text-teal-600" />,
  },
  {
    title: "Pre Trade Plan",
    href: "/videos/pre-trade-plan",
    description: "Develop effective pre-trade planning strategies.",
    icon: <Icons.focusedArea className="h-5 w-5 text-teal-600" />,
  },
]

export function MainNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.dashboard className="h-4 w-4 mr-2" />
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/portfolio" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.portfolio className="h-4 w-4 mr-2" />
              Portfolio
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Icons.petZone className="h-4 w-4 mr-2" />
            PET Zone
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              {petZoneItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/invest-premium" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.investPremium className="h-4 w-4 mr-2" />
              Invest Premium
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Icons.videos className="h-4 w-4 mr-2" />
            Videos
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              {videoItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/meetings" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.meetings className="h-4 w-4 mr-2" />
              Meetings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/downloads" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.downloads className="h-4 w-4 mr-2" />
              Downloads
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/how-we-help" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.help className="h-4 w-4 mr-2" />
              How We Help
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-500 mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem" 