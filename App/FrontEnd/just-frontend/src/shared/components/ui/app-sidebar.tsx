'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { AvatarSidebar } from "./avatar-sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AllUrls from "@/urls"
import { User, PackageSearch, Archive, Users, BadgeDollarSign, ChartSpline } from "lucide-react"
export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Image
              src="/Logo_Just.svg"
              alt="Just Logo"
              width={62}
              height={62}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-md font-bold ">Distribuidores Just</span>
              <span className="text-sm font-light ">Panel de control</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:dashboard']}>
                <Link href={AllUrls['dashboard:dashboard']}>
                  <ChartSpline size={244} />
                  <span className="font-bold pl-1">Panel de Control</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:products']}>
                <Link href={AllUrls['dashboard:products']}>
                  <Archive size={244} />
                  <span className="font-bold pl-1">Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:inventory']}>
                <Link href={AllUrls['dashboard:inventory']}>
                  <PackageSearch size={244} />
                  <span className="font-bold pl-1">Inventario</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:customers']}>
                <Link href={AllUrls['dashboard:customers']}>
                  <Users size={244} />
                  <span className="font-bold pl-1">Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:sales']}>
                <Link href={AllUrls['dashboard:sales']}>
                  <BadgeDollarSign size={244} />
                  <span className="font-bold pl-1">Ventas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['dashboard:profile']}>
              <Link href={AllUrls['dashboard:profile']}>
                <AvatarSidebar
                  src="https://avatars.githubusercontent.com/u/118492050?s=400&u=ed3469fc5e2e6147c1367153eb9274cc7e3cb1fd&v=4"
                  alt="Avatar de John Doe"
                  fallback="JD"
                  size="md"
                />
                <div className="flex flex-col pl-1">
                  <p className="font-bold text-md ">John Doe</p>
                  <p className="font-semibold text-xs ">Consultor destacado</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}