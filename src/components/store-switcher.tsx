'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Store, Plus, ChevronDown } from 'lucide-react'
import { useMultiTenant, Store as StoreType } from '@/lib/multi-tenant'

export function StoreSwitcher() {
  const { store, getUserStores, switchStore, createStore } = useMultiTenant()
  const [stores, setStores] = useState<StoreType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newStoreName, setNewStoreName] = useState('')
  const [newStoreDomain, setNewStoreDomain] = useState('')

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    setIsLoading(true)
    try {
      const userStores = await getUserStores()
      setStores(userStores)
    } catch (error) {
      console.error('Error loading stores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchStore = async (storeId: string) => {
    setIsLoading(true)
    try {
      await switchStore(storeId)
    } catch (error) {
      console.error('Error switching store:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStoreName.trim() || !newStoreDomain.trim()) return

    setIsLoading(true)
    try {
      const result = await createStore({
        name: newStoreName.trim(),
        domain: newStoreDomain.trim().toLowerCase()
      })

      if (result.store) {
        setNewStoreName('')
        setNewStoreDomain('')
        setShowCreateForm(false)
        await loadStores()
      } else {
        alert(result.error || 'Failed to create store')
      }
    } catch (error) {
      console.error('Error creating store:', error)
      alert('Failed to create store')
    } finally {
      setIsLoading(false)
    }
  }

  if (showCreateForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Create New Store</h3>
          <form onSubmit={handleCreateStore} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="My Store"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input
                type="text"
                value={newStoreDomain}
                onChange={(e) => setNewStoreDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="mystore.com"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Store'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <Store className="h-4 w-4" />
            {store ? store.name : 'Select Store'}
            <ChevronDown className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <div className="flex items-center justify-between">
              <span>Stores</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCreateForm(true)}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isLoading ? (
            <DropdownMenuItem disabled>Loading stores...</DropdownMenuItem>
          ) : stores.length === 0 ? (
            <DropdownMenuItem disabled>No stores found</DropdownMenuItem>
          ) : (
            stores.map((storeItem) => (
              <DropdownMenuItem
                key={storeItem.id}
                onClick={() => handleSwitchStore(storeItem.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{storeItem.name}</div>
                    <div className="text-sm text-gray-500">{storeItem.domain}</div>
                  </div>
                </div>
                {store?.id === storeItem.id && (
                  <Badge variant="default">Current</Badge>
                )}
              </DropdownMenuItem>
            ))
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
