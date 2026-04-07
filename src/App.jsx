import { useState, useEffect } from 'react'
import { LayoutDashboard, UtensilsCrossed, Package, Plus, Menu, X } from 'lucide-react'
import { supabase } from './supabaseClient'
import Dashboard from './components/Dashboard'
import CategoryPage from './components/CategoryPage'
import ItemFormModal from './components/ItemFormModal'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Pantry', label: 'Pantry', icon: UtensilsCrossed },
  { key: 'Supplies', label: 'Supplies', icon: Package },
]

export default function App() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('last_updated', { ascending: false })
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

  // Collect all unique tags across all items for reuse
  const allTags = [...new Set(items.flatMap((i) => i.tags || []))].sort()

  const handleSave = async (item) => {
    const now = new Date().toISOString()

    if (item.id) {
      // Editing an existing item — just update
      const { error } = await supabase
        .from('inventory')
        .update({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
          tags: item.tags || [],
          last_updated: now,
        })
        .eq('id', item.id)
      if (error) console.error('Error updating:', error)
    } else {
      // New item — check for case-insensitive duplicate
      const duplicate = items.find(
        (existing) =>
          existing.name.toLowerCase() === item.name.toLowerCase() &&
          existing.category === item.category
      )

      if (duplicate) {
        // Merge: add quantity to existing item, update timestamp
        const { error } = await supabase
          .from('inventory')
          .update({
            current_quantity: duplicate.current_quantity + item.current_quantity,
            tags: [...new Set([...(duplicate.tags || []), ...(item.tags || [])])],
            last_updated: now,
          })
          .eq('id', duplicate.id)
        if (error) console.error('Error merging:', error)
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert({
            name: item.name,
            category: item.category,
            current_quantity: item.current_quantity,
            unit: item.unit,
            low_stock_threshold: item.low_stock_threshold,
            tags: item.tags || [],
            last_updated: now,
          })
        if (error) console.error('Error inserting:', error)
      }
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

  const navigate = (key) => {
    setPage(key)
    setMenuOpen(false)
  }

  const currentNav = NAV_ITEMS.find((n) => n.key === page)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 active:bg-gray-200 transition"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {currentNav?.label || 'Dashboard'}
            </h1>
          </div>
          {page !== 'dashboard' && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-blue-700 hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Add Item
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-10 bg-black/30" onClick={() => setMenuOpen(false)} />
      )}

      {/* Slide-out Menu */}
      <nav
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-xl transition-transform duration-200 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <span className="text-base font-bold text-gray-900">Household Inventory</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <ul className="p-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => navigate(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  page === key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-5">
        {loading ? (
          <p className="py-12 text-center text-gray-400">Loading...</p>
        ) : page === 'dashboard' ? (
          <Dashboard items={items} />
        ) : (
          <CategoryPage
            category={page}
            items={items}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Modal */}
      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        initialData={editingItem}
        category={page === 'dashboard' ? 'Pantry' : page}
        allTags={allTags}
      />
    </div>
  )
}
