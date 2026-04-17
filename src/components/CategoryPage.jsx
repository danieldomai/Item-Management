import { useState } from 'react'
import { Plus, ArrowUpDown, Tag } from 'lucide-react'
import { useInventory } from '../context/InventoryContext'
import ItemCard from './ItemCard'

const SORT_OPTIONS = [
  { key: 'recent', label: 'Most Recent' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'az', label: 'A → Z' },
  { key: 'tags', label: 'By Tag' },
]

function sortItems(items, sortBy) {
  const sorted = [...items]
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.last_updated) - new Date(b.last_updated))
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}

function groupByTags(items) {
  const groups = {}
  const uncategorized = []

  for (const item of items) {
    const tags = item.tags || []
    if (tags.length === 0) uncategorized.push(item)
    else for (const tag of tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(item)
    }
  }

  const sortedGroups = Object.keys(groups)
    .sort()
    .map((tag) => ({ tag, items: groups[tag] }))

  if (uncategorized.length > 0) sortedGroups.push({ tag: 'Uncategorized', items: uncategorized })
  return sortedGroups
}

export default function CategoryPage({ category, onAdd, onEdit }) {
  const { items, deleteItem } = useInventory()
  const [sortBy, setSortBy] = useState('recent')
  const filtered = items.filter((i) => i.category === category)
  const sorted = sortItems(filtered, sortBy)
  const tagGroups = groupByTags(filtered)

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await deleteItem(id)
  }

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

      {filtered.length > 0 && (
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          No {category.toLowerCase()} items yet. Tap "Add Item" to get started.
        </p>
      ) : sortBy === 'tags' ? (
        <div className="space-y-5">
          {tagGroups.map(({ tag, items: groupItems }) => (
            <div key={tag}>
              <div className="mb-2 flex items-center gap-2">
                <Tag size={14} className={tag === 'Uncategorized' ? 'text-gray-400' : 'text-blue-500'} />
                <h3 className={`text-sm font-semibold ${tag === 'Uncategorized' ? 'text-gray-400' : 'text-gray-700'}`}>
                  {tag}
                  <span className="ml-1.5 text-xs font-normal text-gray-400">({groupItems.length})</span>
                </h3>
              </div>
              <div className="space-y-2">
                {groupItems.map((item) => (
                  <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
