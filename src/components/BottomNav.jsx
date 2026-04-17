import { LayoutDashboard, UtensilsCrossed, Package, ListChecks } from 'lucide-react'
import { useInventory } from '../context/InventoryContext'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Pantry', label: 'Pantry', icon: UtensilsCrossed },
  { key: 'Supplies', label: 'Supplies', icon: Package },
  { key: 'list', label: 'List', icon: ListChecks },
]

export default function BottomNav({ page, onNavigate }) {
  const { shoppingList } = useInventory()
  const remainingCount = shoppingList.filter((i) => !i.checked).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = page === key
          const isList = key === 'list'
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium transition ${
                active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {isList && remainingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                    {remainingCount}
                  </span>
                )}
              </div>
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
