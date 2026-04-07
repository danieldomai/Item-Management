import { useState } from 'react'
import { X, Plus, ShoppingCart, Check, Trash2 } from 'lucide-react'

export default function ShoppingList({ listItems, setListItems, onComplete }) {
  const [newItemName, setNewItemName] = useState('')

  const totalItems = listItems.length
  const checkedCount = listItems.filter((i) => i.checked).length
  const remainingCount = totalItems - checkedCount

  const toggleCheck = (id) => {
    setListItems((prev) => {
      const updated = prev.map((item) =>
        item.listId === id ? { ...item, checked: !item.checked } : item
      )
      // Sort: unchecked first, checked at bottom
      return [
        ...updated.filter((i) => !i.checked),
        ...updated.filter((i) => i.checked),
      ]
    })
  }

  const removeItem = (id) => {
    setListItems((prev) => prev.filter((item) => item.listId !== id))
  }

  const updateAmountToBuy = (id, amount) => {
    setListItems((prev) =>
      prev.map((item) =>
        item.listId === id ? { ...item, amountToBuy: amount } : item
      )
    )
  }

  const addManualItem = () => {
    const name = newItemName.trim()
    if (!name) return
    // Case-insensitive duplicate check within the list
    if (listItems.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      setNewItemName('')
      return
    }
    setListItems((prev) => [
      {
        listId: crypto.randomUUID(),
        name,
        unit: '',
        current_quantity: 0,
        amountToBuy: '',
        checked: false,
        isManual: true,
      },
      ...prev,
    ])
    setNewItemName('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addManualItem()
    }
  }

  if (totalItems === 0) return null

  return (
    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
      {/* Header & Stats */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-emerald-700" />
          <h3 className="text-base font-semibold text-emerald-900">Shopping List</h3>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <span className="rounded-full bg-emerald-200 px-2.5 py-1 text-emerald-800">
            {totalItems} total
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-emerald-700 border border-emerald-300">
            {remainingCount} remaining
          </span>
        </div>
      </div>

      {/* Add Item Input */}
      <div className="mb-3 flex gap-2">
        <input
          type="text"
          placeholder="Add an item manually..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
        />
        <button
          onClick={addManualItem}
          className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2.5 text-white hover:bg-emerald-700 active:bg-emerald-800 transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List Items */}
      <ul className="space-y-2">
        {listItems.map((item) => (
          <li
            key={item.listId}
            className={`flex items-center gap-3 rounded-xl border bg-white p-3 transition-all duration-300 ${
              item.checked
                ? 'border-gray-200 opacity-60'
                : 'border-emerald-200'
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleCheck(item.listId)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                item.checked
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-gray-300 hover:border-emerald-400'
              }`}
            >
              {item.checked && <Check size={14} />}
            </button>

            {/* Name & Quantity */}
            <div className="min-w-0 flex-1">
              <span
                className={`block text-sm font-medium transition-all duration-300 ${
                  item.checked ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {item.name}
              </span>
              {item.current_quantity > 0 && (
                <span className="text-xs text-gray-400">
                  Have: {item.current_quantity} {item.unit}
                </span>
              )}
            </div>

            {/* Amount to Buy */}
            <input
              type="number"
              step="any"
              min="0"
              placeholder="Qty"
              value={item.amountToBuy}
              onChange={(e) => updateAmountToBuy(item.listId, e.target.value)}
              className={`w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 ${
                item.checked ? 'bg-gray-50 text-gray-400' : ''
              }`}
            />

            {/* Remove */}
            <button
              onClick={() => removeItem(item.listId)}
              className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 transition"
      >
        Complete List
      </button>
    </div>
  )
}
