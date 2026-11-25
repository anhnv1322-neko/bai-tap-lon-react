interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw_-_2rem)] items-center gap-3 border bg-white px-4 py-3 text-sm ${type === 'success' ? 'border-[#9ab89c] text-[#315f37]' : 'border-[#d7a0a0] text-[#a32929]'}`} role="status">
      <span>{type === 'success' ? '✓' : '!'}</span>
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 text-lg leading-none text-[#666666]" aria-label="Đóng thông báo">×</button>
    </div>
  )
}