import { Plus } from 'lucide-react'
import ItemCard from './ItemCard'

export default function CategoryPage({ category, items, onAdd, onEdit, onDelete }) {
  const filtered = items.filter((i) => i.category === category)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{category}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-blue-700 hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          No {category.toLowerCase()} items yet. Tap "Add Item" to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
