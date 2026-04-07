import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

const UNITS = ['whole', 'cups', 'tsp', 'tbsp', 'oz', 'lbs', 'gallons', 'liters', 'ml', 'packs', 'bags', 'bottles', 'cans', 'boxes']

export default function ItemFormModal({ isOpen, onClose, onSave, initialData, category, allTags = [] }) {
  const [form, setForm] = useState({
    name: '',
    category: category || 'Pantry',
    current_quantity: '',
    unit: 'whole',
    low_stock_threshold: '',
    target_capacity: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        category: initialData.category,
        current_quantity: String(initialData.current_quantity),
        unit: initialData.unit,
        low_stock_threshold: String(initialData.low_stock_threshold),
        target_capacity: initialData.target_capacity ? String(initialData.target_capacity) : '',
        tags: initialData.tags || [],
      })
    } else {
      setForm({
        name: '',
        category: category || 'Pantry',
        current_quantity: '',
        unit: 'whole',
        low_stock_threshold: '',
        target_capacity: '',
        tags: [],
      })
    }
    setTagInput('')
  }, [initialData, category, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...initialData,
      name: form.name.trim(),
      category: form.category,
      current_quantity: parseFloat(form.current_quantity) || 0,
      unit: form.unit,
      low_stock_threshold: parseFloat(form.low_stock_threshold) || 1,
      target_capacity: parseFloat(form.target_capacity) || null,
      tags: form.tags,
    })
  }

  const addTag = (tag) => {
    const cleaned = tag.trim()
    if (cleaned && !form.tags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setForm({ ...form, tags: [...form.tags, cleaned] })
    }
    setTagInput('')
  }

  const removeTag = (index) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) })
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Suggestions: existing tags not already selected
  const suggestions = allTags.filter(
    (t) =>
      !form.tags.some((ft) => ft.toLowerCase() === t.toLowerCase()) &&
      t.toLowerCase().includes(tagInput.toLowerCase())
  )

  const inputClass = 'w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              type="text"
              required
              placeholder="e.g. Rice, Paper Towels"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Pantry">Pantry</option>
              <option value="Supplies">Supplies</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Quantity</label>
              <input
                className={inputClass}
                type="number"
                step="any"
                min="0"
                required
                placeholder="0"
                value={form.current_quantity}
                onChange={(e) => setForm({ ...form, current_quantity: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <select
                className={inputClass}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Low Stock Threshold</label>
              <input
                className={inputClass}
                type="number"
                step="any"
                min="0"
                required
                placeholder="1"
                value={form.low_stock_threshold}
                onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Target Capacity</label>
              <input
                className={inputClass}
                type="number"
                step="any"
                min="0"
                placeholder="Optional"
                value={form.target_capacity}
                onChange={(e) => setForm({ ...form, target_capacity: e.target.value })}
              />
            </div>
          </div>
          <p className="!mt-1 text-xs text-gray-500">
            Low stock alert triggers at threshold or when below 20% of target capacity.
          </p>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            {form.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {form.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                className={inputClass}
                type="text"
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="shrink-0 rounded-lg bg-gray-200 px-3 py-2 hover:bg-gray-300 active:bg-gray-400 transition"
              >
                <Plus size={18} />
              </button>
            </div>
            {tagInput && suggestions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white active:bg-blue-700 hover:bg-blue-700 transition"
          >
            {initialData ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  )
}
