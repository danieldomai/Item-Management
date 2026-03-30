import { useState, useEffect } from 'react'
import { Plus, UtensilsCrossed, Package } from 'lucide-react'
import { supabase } from './supabaseClient'
import LowStockBanner from './components/LowStockBanner'
import ItemCard from './components/ItemCard'
import ItemFormModal from './components/ItemFormModal'

const TABS = [
  { key: 'Pantry', label: 'Pantry', icon: UtensilsCrossed },
  { key: 'Supplies', label: 'Supplies', icon: Package },
]

export default function App() {
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('Pantry')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name')
    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSave = async (item) => {
    if (item.id) {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
        })
        .eq('id', item.id)
      if (error) console.error('Error updating:', error)
    } else {
      const { error } = await supabase
        .from('inventory')
        .insert({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
        })
      if (error) console.error('Error inserting:', error)
    }
    setModalOpen(false)
    setEditingItem(null)
    fetchItems()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    const { error } = await supabase.from('inventory').delete().eq('id', id)
    if (error) console.error('Error deleting:', error)
    fetchItems()
  }

  const openAdd = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const lowStockItems = items.filter(
    (i) => i.current_quantity <= i.low_stock_threshold
  )
  const filteredItems = items.filter((i) => i.category === activeTab)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Household Inventory</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-blue-700 hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Low Stock Banner */}
        <LowStockBanner items={lowStockItems} />

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl bg-gray-200 p-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Item List */}
        {loading ? (
          <p className="py-12 text-center text-gray-400">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            No {activeTab.toLowerCase()} items yet. Tap "Add Item" to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        initialData={editingItem}
        category={activeTab}
      />
    </div>
  )
}
