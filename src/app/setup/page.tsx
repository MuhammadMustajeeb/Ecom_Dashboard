'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Plus, ArrowRight } from 'lucide-react'
import { useMultiTenant } from '@/lib/multi-tenant'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const { store, getUserStores, createStore, switchStore } = useMultiTenant()
  const [stores, setStores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newStoreName, setNewStoreName] = useState('')
  const [newStoreDomain, setNewStoreDomain] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadStores()
  }, [])

  useEffect(() => {
    if (store) {
      router.push('/')
    }
  }, [store, router])

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
      router.push('/')
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
        router.push('/')
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
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create New Store</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStore} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="My Awesome Store"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Domain</label>
                  <input
                    type="text"
                    value={newStoreDomain}
                    onChange={(e) => setNewStoreDomain(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="mystore.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be your unique store identifier
                  </p>
                </div>
                <div className="flex gap-3">
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
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to EcomDash
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select an existing store or create a new one to get started with your ecommerce analytics dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCreateForm(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set up a new store and start tracking your ecommerce analytics immediately
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-medium">
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Existing Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access your existing stores and continue tracking their performance
              </p>
              <div className="mt-4 text-gray-900 font-medium">
                {stores.length} {stores.length === 1 ? 'Store' : 'Stores'} Available
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store List */}
        {stores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                        <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {store.name}
                        </h3>
                        <p className="text-sm text-gray-500">{store.domain}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSwitchStore(store.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Switching...' : 'Open Dashboard'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {stores.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No stores yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first store to start using EcomDash
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Store
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
