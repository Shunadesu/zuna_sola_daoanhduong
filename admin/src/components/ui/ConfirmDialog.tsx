import { AlertTriangle } from "lucide-react"
import { Modal } from "./Modal"
import { Button } from "./Button"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "default"
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const confirmButtonClass =
    variant === "danger"
      ? "bg-destructive hover:bg-destructive/90"
      : variant === "warning"
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : "bg-primary hover:bg-primary/90"

  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`rounded-full p-3 mb-4 ${
            variant === "danger"
              ? "bg-red-100"
              : variant === "warning"
              ? "bg-yellow-100"
              : "bg-blue-100"
          }`}
        >
          <AlertTriangle
            className={`h-6 w-6 ${
              variant === "danger"
                ? "text-destructive"
                : variant === "warning"
                ? "text-yellow-600"
                : "text-primary"
            }`}
          />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            className={`flex-1 text-white ${confirmButtonClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
