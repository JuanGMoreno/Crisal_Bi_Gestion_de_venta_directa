import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"

interface AvatarSidebarProps {
    src: string,
    alt: string,
    fallback: string
    size: string
    className?: string
}


export function AvatarSidebar({ src, alt, fallback, className }: AvatarSidebarProps) {
  return (
    <Avatar className={className} >
      <AvatarImage
        src={src}
        alt={alt}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
