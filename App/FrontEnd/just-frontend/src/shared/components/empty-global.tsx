
import { Button } from "@/shared/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty"

interface EmptyGlobalProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
    className?: string;
}


export function EmptyGlobal({ icon, title, description, buttonText, onButtonClick, className }: EmptyGlobalProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {buttonText && onButtonClick ? (
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
