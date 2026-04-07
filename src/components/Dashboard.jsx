import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, ShoppingBasket, ListPlus } from 'lucide-react'

const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6']

function getReplenishmentItems(items) {
  return items.filter((item) => {
    const belowThreshold = item.current_quantity <= item.low_stock_threshold
    const belowCapacity =
      item.target_capacity > 0 &&
      item.current_quantity <= item.target_capacity * 0.2
    return belowThreshold || belowCapacity
  })
}

function ChartSection({ title, items }) {
  const data = items.map((item) => ({
    name: item.name,
    quantity: item.current_quantity,
    threshold: item.low_stock_threshold,
    unit: item.unit,
  }))

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="py-8 text-center text-gray-400">No items yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''} tracked</p>
      <div style={{ width: '100%', height: Math.max(200, items.length * 40 + 40) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13 }} />
            <Tooltip
              formatter={(value, _name, props) => [`${value} ${props.payload.unit}`, 'Quantity']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.quantity <= entry.threshold ? '#f59e0b' : BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function Dashboard({ items, onGenerateList }) {
  const pantryItems = items.filter((i) => i.category === 'Pantry')
  const suppliesItems = items.filter((i) => i.category === 'Supplies')
  const replenishItems = getReplenishmentItems(items)

  return (
    <div className="space-y-5">
      {/* Recommended Replenishment */}
      {replenishItems.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              <h3 className="text-base font-semibold text-amber-800">
                Recommended Replenishment ({replenishItems.length})
              </h3>
            </div>
          </div>
          <ul className="space-y-1.5 mb-4">
            {replenishItems.map((item) => {
              const reasons = []
              if (item.current_quantity <= item.low_stock_threshold) {
                reasons.push('below threshold')
              }
              if (item.target_capacity > 0 && item.current_quantity <= item.target_capacity * 0.2) {
                reasons.push(`≤20% capacity`)
              }
              return (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-amber-900">{item.name}</span>
                    <span className="ml-2 text-xs text-amber-600">({reasons.join(', ')})</span>
                  </div>
                  <span className="text-amber-700">
                    {item.current_quantity} {item.unit}
                    {item.target_capacity > 0 && (
                      <span className="text-xs text-amber-500"> / {item.target_capacity}</span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
          <button
            onClick={() => onGenerateList(replenishItems)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white hover:bg-amber-700 active:bg-amber-800 transition"
          >
            <ListPlus size={18} />
            Generate Shopping List
          </button>
        </div>
      )}

      {/* No replenishment needed */}
      {replenishItems.length === 0 && items.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <ShoppingBasket size={28} className="mx-auto mb-2 text-green-600" />
          <p className="text-sm font-medium text-green-800">All stocked up!</p>
          <p className="text-xs text-green-600">No items need replenishment right now.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          <p className="text-xs text-gray-500">Total Items</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{pantryItems.length}</p>
          <p className="text-xs text-gray-500">Pantry</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">{suppliesItems.length}</p>
          <p className="text-xs text-gray-500">Supplies</p>
        </div>
      </div>

      {/* Bar Charts */}
      <ChartSection title="Pantry Items" items={pantryItems} />
      <ChartSection title="Supplies Items" items={suppliesItems} />
    </div>
  )
}
