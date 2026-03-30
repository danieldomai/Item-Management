import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const UNITS = ['whole', 'cups', 'tsp', 'tbsp', 'oz', 'lbs', 'gallons', 'liters', 'ml', 'packs', 'bags', 'bottles', 'cans', 'boxes']

export default function ItemFormModal({ isOpen, onClose, onSave, initialData, category }) {
  const [form, setForm] = useState({
    name: '',
    category: category || 'Pantry',
    current_quantity: '',
    unit: 'whole',
    low_stock_threshold: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        category: initialData.category,
        current_quantity: String(initialData.current_quantity),
        unit: initialData.unit,
        low_stock_threshold: String(initialData.low_stock_threshold),
      })
    } else {
      setForm({
        name: '',
        category: category || 'Pantry',
        current_quantity: '',
        unit: 'whole',
        low_stock_threshold: '',
      })
    }
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
    })
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
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
            <p className="mt-1 text-xs text-gray-500">
              You'll see a warning when quantity falls to or below this number.
            </p>
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
