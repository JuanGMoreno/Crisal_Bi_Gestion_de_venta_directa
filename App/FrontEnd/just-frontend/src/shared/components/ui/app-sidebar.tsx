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
import { PackageSearch, Archive, Users, BadgeDollarSign, ChartSpline, Network } from "lucide-react"
import { useDistributorChildrenQuery } from "@/features/profile/hooks/useDistributorChildrenQuery"
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery"
import { BRAND } from "@/shared/config/brand"

function canManageTeam(role?: string) {
  return role === "Lider" || role === "Lider de Grupo"
}

export function AppSidebar() {
  const pathname = usePathname()
  const { data: profile } = useProfileQuery()
  const canSeeTeam = canManageTeam(profile?.rol)
  const { data: children = [] } = useDistributorChildrenQuery(Boolean(profile && canSeeTeam))
  const shouldShowTeam = canSeeTeam && children.length > 0

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2" >
            <SidebarMenuButton asChild size={"lg"}>
              <Link href={AllUrls['system:index']}>
                <Image
                  src={BRAND.logo}
                  alt={`${BRAND.productName} logo`}
                  width={62}
                  height={62}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-md font-bold ">{BRAND.productName}</span>
                  <span className="text-sm font-light ">Gestion comercial</span>
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
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:dashboard']}>
                <Link href={AllUrls['system:dashboard']}>
                  <ChartSpline size={244} />
                  <span className="font-bold pl-1">Panel de Control</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:products']}>
                <Link href={AllUrls['system:products']}>
                  <Archive size={244} />
                  <span className="font-bold pl-1">Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:inventory']}>
                <Link href={AllUrls['system:inventory']}>
                  <PackageSearch size={244} />
                  <span className="font-bold pl-1">Inventario</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:customers']}>
                <Link href={AllUrls['system:customers']}>
                  <Users size={244} />
                  <span className="font-bold pl-1">Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:sales']}>
                <Link href={AllUrls['system:sales']}>
                  <BadgeDollarSign size={244} />
                  <span className="font-bold pl-1">Ventas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {shouldShowTeam ? (
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:team']}>
                  <Link href={AllUrls['system:team']}>
                    <Network size={244} />
                    <span className="font-bold pl-1">Equipo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton asChild size="lg" isActive={pathname === AllUrls['system:profile']}>
              <Link href={AllUrls['system:profile']}>
                <AvatarSidebar
                  src={profile?.foto_avatar?.trim() || BRAND.logo}
                  alt={profile?.nombre || "Perfil"}
                  fallback={profile?.nombre?.slice(0, 2).toUpperCase() || "CR"}
                  size="md"
                />
                <div className="flex flex-col pl-1">
                  <p className="font-bold text-md ">{profile?.nombre || "Mi perfil"}</p>
                  <p className="font-semibold text-xs ">{profile?.rol || "Distribuidor"}</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
