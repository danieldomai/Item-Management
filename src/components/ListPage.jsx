import { ListChecks, Sparkles } from 'lucide-react'
import { useInventory } from '../context/InventoryContext'
import ShoppingList from './ShoppingList'

export default function ListPage({ onGoDashboard }) {
  const { shoppingList, setShoppingList, clearShoppingList, replenishItems, generateShoppingList } =
    useInventory()

  if (shoppingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <ListChecks size={40} className="mb-3 text-gray-300" />
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Your list is empty</h2>
        <p className="mb-5 max-w-xs text-sm text-gray-500">
          Generate a shopping list from items that are running low, or add items manually below.
        </p>

        {replenishItems.length > 0 ? (
          <button
            onClick={generateShoppingList}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 transition"
          >
            <Sparkles size={18} />
            Generate from {replenishItems.length} low-stock item{replenishItems.length !== 1 ? 's' : ''}
          </button>
        ) : (
          <button
            onClick={onGoDashboard}
            className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition"
          >
            Go to Dashboard
          </button>
        )}

        {/* Allow manual adds even on empty state */}
        <div className="mt-5 w-full">
          <ShoppingList
            listItems={shoppingList}
            setListItems={setShoppingList}
            onComplete={clearShoppingList}
            emptyModeManualAdd
          />
        </div>
      </div>
    )
  }

  return (
    <ShoppingList
      listItems={shoppingList}
      setListItems={setShoppingList}
      onComplete={clearShoppingList}
    />
  )
}
