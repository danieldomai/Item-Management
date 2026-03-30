import { Pencil, Trash2, AlertTriangle } from 'lucide-react'

export default function ItemCard({ item, onEdit, onDelete }) {
  const isLow = item.current_quantity <= item.low_stock_threshold

  return (
    <div className={`flex items-center justify-between rounded-xl border p-4 ${isLow ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {isLow && <AlertTriangle size={16} className="shrink-0 text-amber-500" />}
          <span className="truncate font-medium text-gray-900">{item.name}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {item.current_quantity} {item.unit}
          <span className="ml-2 text-xs text-gray-400">(low at {item.low_stock_threshold})</span>
        </p>
      </div>

      <div className="ml-3 flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(item)}
          className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition"
          aria-label="Edit"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="rounded-lg p-2.5 text-red-400 hover:bg-red-50 active:bg-red-100 transition"
          aria-label="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
