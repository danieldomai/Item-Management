import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabaseClient'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [shoppingList, setShoppingList] = useState([])

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('last_updated', { ascending: false })
    if (error) console.error('Error fetching items:', error)
    else setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Derived state: low stock items (threshold OR ≤20% of target_capacity)
  const replenishItems = useMemo(
    () =>
      items.filter((item) => {
        const belowThreshold = item.current_quantity <= item.low_stock_threshold
        const belowCapacity =
          item.target_capacity > 0 &&
          item.current_quantity < item.target_capacity * 0.2
        return belowThreshold || belowCapacity
      }),
    [items]
  )

  const allTags = useMemo(
    () => [...new Set(items.flatMap((i) => i.tags || []))].sort(),
    [items]
  )

  const saveItem = async (item) => {
    const now = new Date().toISOString()

    if (item.id) {
      const { error } = await supabase
        .from('inventory')
        .update({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
          target_capacity: item.target_capacity || null,
          tags: item.tags || [],
          last_updated: now,
        })
        .eq('id', item.id)
      if (error) console.error('Error updating:', error)
    } else {
      const duplicate = items.find(
        (existing) =>
          existing.name.toLowerCase() === item.name.toLowerCase() &&
          existing.category === item.category
      )

      if (duplicate) {
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
        const { error } = await supabase.from('inventory').insert({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
          target_capacity: item.target_capacity || null,
          tags: item.tags || [],
          last_updated: now,
        })
        if (error) console.error('Error inserting:', error)
      }
    }
    await fetchItems()
  }

  const deleteItem = async (id) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id)
    if (error) console.error('Error deleting:', error)
    await fetchItems()
  }

  const generateShoppingList = () => {
    const existingInventoryIds = new Set(
      shoppingList.filter((i) => i.inventoryId).map((i) => i.inventoryId)
    )
    const newItems = replenishItems
      .filter((item) => !existingInventoryIds.has(item.id))
      .map((item) => ({
        listId: crypto.randomUUID(),
        inventoryId: item.id,
        name: item.name,
        unit: item.unit,
        current_quantity: item.current_quantity,
        target_capacity: item.target_capacity,
        amountToBuy: '',
        checked: false,
        isManual: false,
      }))
    setShoppingList((prev) => [...newItems, ...prev])
  }

  const clearShoppingList = () => setShoppingList([])

  const value = {
    items,
    loading,
    replenishItems,
    allTags,
    shoppingList,
    setShoppingList,
    fetchItems,
    saveItem,
    deleteItem,
    generateShoppingList,
    clearShoppingList,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider')
  return ctx
}
