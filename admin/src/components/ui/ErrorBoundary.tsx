import * as React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./Button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-16 text-center">
          <div className="bg-destructive/10 rounded-full p-4 mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {this.state.error?.message || "Đã có lỗi không mong muốn xảy ra."}
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tải lại trang
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
