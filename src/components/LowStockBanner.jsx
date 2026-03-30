import { AlertTriangle } from 'lucide-react'

export default function LowStockBanner({ items }) {
  if (items.length === 0) return null

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle size={20} className="text-amber-600" />
        <h2 className="text-base font-semibold text-amber-800">Low Stock ({items.length})</h2>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-amber-900 font-medium">{item.name}</span>
            <span className="text-amber-700">
              {item.current_quantity} {item.unit} remaining
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
