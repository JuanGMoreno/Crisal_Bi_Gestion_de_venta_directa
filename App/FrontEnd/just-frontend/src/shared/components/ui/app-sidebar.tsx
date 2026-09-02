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
import { PackageSearch, Archive, Users, BadgeDollarSign, ChartSpline } from "lucide-react"
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery"
import { BRAND } from "@/shared/config/brand"

export function AppSidebar() {
  const pathname = usePathname()
  const { data: profile } = useProfileQuery()
  const profileName = profile?.nombre?.trim() || "Mi perfil"

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip={BRAND.productName}>
              <Link
                href={AllUrls['system:index']}
                aria-label={`${BRAND.productName}: ir al inicio`}
              >
                <Image
                  src={BRAND.logo}
                  alt=""
                  width={52}
                  height={52}
                  loading="eager"
                  className="size-8 shrink-0 rounded-full object-contain"
                />
                <div className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-sm font-bold">{BRAND.productName}</span>
                  <span className="block truncate text-xs font-light">Gestión comercial</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Panel de Control" isActive={pathname === AllUrls['system:dashboard']}>
                <Link href={AllUrls['system:dashboard']}>
                  <ChartSpline aria-hidden="true" />
                  <span className="font-bold pl-1">Panel de Control</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Productos" isActive={pathname === AllUrls['system:products']}>
                <Link href={AllUrls['system:products']}>
                  <Archive aria-hidden="true" />
                  <span className="font-bold pl-1">Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Inventario" isActive={pathname === AllUrls['system:inventory']}>
                <Link href={AllUrls['system:inventory']}>
                  <PackageSearch aria-hidden="true" />
                  <span className="font-bold pl-1">Inventario</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Clientes" isActive={pathname === AllUrls['system:customers']}>
                <Link href={AllUrls['system:customers']}>
                  <Users aria-hidden="true" />
                  <span className="font-bold pl-1">Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Ventas" isActive={pathname === AllUrls['system:sales']}>
                <Link href={AllUrls['system:sales']}>
                  <BadgeDollarSign aria-hidden="true" />
                  <span className="font-bold pl-1">Ventas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={profileName}
              isActive={pathname === AllUrls['system:profile']}
            >
              <Link
                href={AllUrls['system:profile']}
                aria-label={`Abrir perfil de ${profileName}`}
              >
                <AvatarSidebar
                  src={profile?.foto_avatar?.trim() || BRAND.logo}
                  alt=""
                  fallback={profileName.slice(0, 2).toUpperCase()}
                  className="size-8"
                />
                <div className="min-w-0 flex-1 pl-1 leading-tight">
                  <p className="truncate text-sm font-bold" title={profileName}>{profileName}</p>
                  <p className="truncate text-xs font-semibold">Mi negocio</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
