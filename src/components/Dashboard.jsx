import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle } from 'lucide-react'

const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6']

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

export default function Dashboard({ items }) {
  const pantryItems = items.filter((i) => i.category === 'Pantry')
  const suppliesItems = items.filter((i) => i.category === 'Supplies')
  const lowStockItems = items.filter((i) => i.current_quantity <= i.low_stock_threshold)

  return (
    <div className="space-y-5">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="text-base font-semibold text-amber-800">
              Low Stock ({lowStockItems.length})
            </h3>
          </div>
          <ul className="space-y-1.5">
            {lowStockItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-amber-900">{item.name}</span>
                <span className="text-amber-700">
                  {item.current_quantity} {item.unit} remaining
                </span>
              </li>
            ))}
          </ul>
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
