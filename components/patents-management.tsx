"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Patent } from "@/lib/models"

export function PatentsManagement() {
  const [patents, setPatents] = useState<Patent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPatent, setEditingPatent] = useState<Patent | null>(null)
  const [formData, setFormData] = useState({
    type: "National" as "National" | "International",
    title: "",
    date: "",
    status: "",
    number: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPatents()
  }, [])

  const fetchPatents = async () => {
    try {
      const response = await fetch("/api/patents")
      if (response.ok) {
        const data = await response.json()
        setPatents(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.status || !formData.number) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingPatent ? `/api/patents/${editingPatent._id}` : "/api/patents"
      const method = editingPatent ? "PUT" : "POST"

      const submitData = {
        ...formData,
        date: new Date(formData.date),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Patent ${editingPatent ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchPatents()
      } else {
        throw new Error("Failed to save patent")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save patent",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patent?")) return

    try {
      const response = await fetch(`/api/patents/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Patent deleted successfully",
        })
        fetchPatents()
      } else {
        throw new Error("Failed to delete patent")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patent",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (patent: Patent) => {
    setEditingPatent(patent)
    setFormData({
      type: patent.type,
      title: patent.title,
      date: new Date(patent.date).toISOString().split("T")[0],
      status: patent.status,
      number: patent.number,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      type: "National",
      title: "",
      date: "",
      status: "",
      number: "",
    })
    setEditingPatent(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Patents</h3>
          <p className="text-sm text-muted-foreground">Manage your patent applications and registrations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Patent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPatent ? "Edit" : "Add"} Patent</DialogTitle>
              <DialogDescription>
                {editingPatent ? "Update the patent details" : "Add a new patent application"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "National" | "International") =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National">National</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="number">Patent Number</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="Patent application number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Patent title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    placeholder="e.g., Filed, Pending, Granted"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingPatent ? "Update" : "Create"} Patent</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {patents.map((patent) => (
          <Card key={patent._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{patent.title}</CardTitle>
                    <Badge variant={patent.type === "International" ? "default" : "secondary"}>{patent.type}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(patent.date)}
                    </div>
                    <div>Patent Number: {patent.number}</div>
                    <div>
                      Status: <Badge variant="outline">{patent.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(patent)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(patent._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {patents.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No patents added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your patent applications</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Patent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
