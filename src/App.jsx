import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useInventory } from './context/InventoryContext'
import Dashboard from './components/Dashboard'
import CategoryPage from './components/CategoryPage'
import ListPage from './components/ListPage'
import BottomNav from './components/BottomNav'
import ItemFormModal from './components/ItemFormModal'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  Pantry: 'Pantry',
  Supplies: 'Supplies',
  list: 'Shopping List',
}

export default function App() {
  const { loading, allTags, saveItem } = useInventory()
  const [page, setPage] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const openAdd = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleSave = async (item) => {
    await saveItem(item)
    setModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">{PAGE_TITLES[page]}</h1>
          {(page === 'Pantry' || page === 'Supplies') && (
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

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-5">
        {loading ? (
          <p className="py-12 text-center text-gray-400">Loading...</p>
        ) : page === 'dashboard' ? (
          <Dashboard onGoToList={() => setPage('list')} />
        ) : page === 'list' ? (
          <ListPage onGoDashboard={() => setPage('dashboard')} />
        ) : (
          <CategoryPage category={page} onAdd={openAdd} onEdit={openEdit} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav page={page} onNavigate={setPage} />

      {/* Modal */}
      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        initialData={editingItem}
        category={page === 'Pantry' || page === 'Supplies' ? page : 'Pantry'}
        allTags={allTags}
      />
    </div>
  )
}
