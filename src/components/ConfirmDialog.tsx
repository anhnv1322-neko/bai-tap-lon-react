interface ConfirmDialogProps {
  title: string
  message: string
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ title, message, busy, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" role="presentation">
      <div className="w-full max-w-md border border-[#aaaaaa] bg-white p-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title" className="text-lg font-bold text-[#222222]">{title}</h2>
        <p className="mt-2 text-sm text-[#555555]">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="border border-[#aaaaaa] bg-[#f5f5f5] px-4 py-2 text-sm hover:bg-[#e8eef3] disabled:opacity-50">Hủy</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="border border-[#8d2822] bg-[#a9342b] px-4 py-2 text-sm text-white hover:bg-[#84251f] disabled:opacity-60">{busy ? 'Đang xóa...' : 'Xác nhận xóa'}</button>
        </div>
      </div>
    </div>
  )
}