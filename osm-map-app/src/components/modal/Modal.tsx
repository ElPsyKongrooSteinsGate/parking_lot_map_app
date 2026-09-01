import { type ReactNode, useEffect } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  title?: string
  children: ReactNode
  onClose?: () => void
  maxWidth?: number | string
  hideCloseButton?: boolean
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  maxWidth = 520,
  hideCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          {title ? <h3 id="modal-title" className="modal-title">{title}</h3> : null}
          {!hideCloseButton ? (
            <button type="button" className="modal-close" aria-label="Close modal" onClick={onClose}>
              ×
            </button>
          ) : null}
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
