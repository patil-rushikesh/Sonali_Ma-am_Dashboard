"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, BookOpen, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Publication } from "@/lib/models"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    type: "journal", // Add type field, default to "journal"
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publications")
      if (response.ok) {
        const data = await response.json()
        setPublications(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch publications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingPublication ? `/api/publications/${editingPublication._id}` : "/api/publications"
      const method = editingPublication ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Publication ${editingPublication ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchPublications()
      } else {
        throw new Error("Failed to save publication")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save publication",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return

    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Publication deleted successfully",
        })
        fetchPublications()
      } else {
        throw new Error("Failed to delete publication")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete publication",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication)
    setFormData({
      name: publication.name,
      description: publication.description,
      link: publication.link || "",
      type: publication.type || "journal", // Add type field
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      link: "",
      type: "journal", // Reset type field
    })
    setEditingPublication(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Publications</h3>
          <p className="text-sm text-muted-foreground">Manage your research publications and papers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPublication ? "Edit" : "Add"} Publication</DialogTitle>
              <DialogDescription>
                {editingPublication ? "Update the publication details" : "Add a new research publication"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "journal" | "book") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Publication Title</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Title of the publication"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the publication content"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com/publication"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingPublication ? "Update" : "Create"} Publication</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {publications.map((publication) => (
          <Card key={publication._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{publication.name}</CardTitle>
                  <CardDescription className="mt-2">{publication.description}</CardDescription>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Type: {publication.type ? (publication.type === "journal" ? "Journal" : "Book") : "Journal"}
                  </div>
                  {publication.link && (
                    <div className="mt-3">
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Publication
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(publication)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(publication._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {publications.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No publications added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your research publications</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
