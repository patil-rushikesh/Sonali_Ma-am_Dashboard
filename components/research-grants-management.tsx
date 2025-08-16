"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, DollarSign, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ResearchGrant } from "@/lib/models"

export function ResearchGrantsManagement() {
  const [grants, setGrants] = useState<ResearchGrant[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGrant, setEditingGrant] = useState<ResearchGrant | null>(null)
  const [formData, setFormData] = useState({
    fundReceived: 0,
    title: "",
    year: new Date().getFullYear(),
    grantAgency: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchGrants()
  }, [])

  const fetchGrants = async () => {
    try {
      const response = await fetch("/api/research-grants")
      if (response.ok) {
        const data = await response.json()
        setGrants(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch research grants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.grantAgency || formData.fundReceived <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingGrant ? `/api/research-grants/${editingGrant._id}` : "/api/research-grants"
      const method = editingGrant ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Research grant ${editingGrant ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchGrants()
      } else {
        throw new Error("Failed to save research grant")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save research grant",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research grant?")) return

    try {
      const response = await fetch(`/api/research-grants/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Research grant deleted successfully",
        })
        fetchGrants()
      } else {
        throw new Error("Failed to delete research grant")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete research grant",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (grant: ResearchGrant) => {
    setEditingGrant(grant)
    setFormData({
      fundReceived: grant.fundReceived,
      title: grant.title,
      year: grant.year,
      grantAgency: grant.grantAgency,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      fundReceived: 0,
      title: "",
      year: new Date().getFullYear(),
      grantAgency: "",
    })
    setEditingGrant(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Research Grants</h3>
          <p className="text-sm text-muted-foreground">Manage your research funding and grants</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Grant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingGrant ? "Edit" : "Add"} Research Grant</DialogTitle>
              <DialogDescription>
                {editingGrant ? "Update the grant details" : "Add a new research grant"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Grant Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Title of the research grant"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundReceived">Fund Received ($)</Label>
                  <Input
                    id="fundReceived"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.fundReceived}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fundReceived: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="Amount received"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="grantAgency">Grant Agency</Label>
                <Input
                  id="grantAgency"
                  value={formData.grantAgency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, grantAgency: e.target.value }))}
                  placeholder="Name of the funding agency"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingGrant ? "Update" : "Create"} Grant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {grants.map((grant) => (
          <Card key={grant._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{grant.title}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {grant.year}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-foreground">{formatCurrency(grant.fundReceived)}</span>
                    </div>
                    <div>Grant Agency: {grant.grantAgency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(grant)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(grant._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {grants.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No research grants added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your research funding and grants</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Grant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
