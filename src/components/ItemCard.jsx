import { Pencil, Trash2, AlertTriangle, Tag } from 'lucide-react'

export default function ItemCard({ item, onEdit, onDelete }) {
  const isLow = item.current_quantity <= item.low_stock_threshold
  const tags = item.tags || []

  return (
    <div className={`rounded-xl border p-4 ${isLow ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between">
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

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
