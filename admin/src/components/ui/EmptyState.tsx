import * as React from "react"
import { Inbox, Search, FileX, PlusCircle, AlertCircle, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

type EmptyStateVariant = "default" | "search" | "no-results" | "create" | "error" | "offline"

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  action?: () => void
  actionLabel?: string
  icon?: React.ReactNode
  className?: string
}

const defaults: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
  default: {
    icon: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
    title: "Không có dữ liệu",
    description: "Dữ liệu sẽ xuất hiện ở đây khi có.",
  },
  search: {
    icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
    title: "Tìm kiếm",
    description: "Nhập từ khóa để tìm kiếm.",
  },
  "no-results": {
    icon: <FileX className="h-12 w-12 text-muted-foreground/50" />,
    title: "Không tìm thấy kết quả",
    description: "Thử thay đổi từ khóa hoặc bộ lọc của bạn.",
  },
  create: {
    icon: <PlusCircle className="h-12 w-12 text-muted-foreground/50" />,
    title: "Sẵn sàng tạo mới",
    description: "Bắt đầu bằng cách tạo một mục mới.",
  },
  error: {
    icon: <AlertCircle className="h-12 w-12 text-destructive" />,
    title: "Đã xảy ra lỗi",
    description: "Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.",
  },
  offline: {
    icon: <WifiOff className="h-12 w-12 text-muted-foreground/50" />,
    title: "Không có kết nối",
    description: "Vui lòng kiểm tra kết nối internet của bạn.",
  },
}

export function EmptyState({
  variant = "default",
  title,
  description,
  action,
  actionLabel,
  icon,
  className,
}: EmptyStateProps) {
  const resolved = defaults[variant]

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-4">
        {icon ?? resolved.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title ?? resolved.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description ?? resolved.description}
      </p>
      {action && actionLabel && (
        <Button onClick={action} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
