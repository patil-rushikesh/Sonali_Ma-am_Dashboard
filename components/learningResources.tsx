"use client"

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
import { Plus, Edit, Trash2, FileText, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { LearningResource } from "@/lib/models"

export function LearningResourcesManagement() {
  const [resources, setResources] = useState<LearningResource[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as "video" | "drive",
    link: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/learningresources")
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch learning resources",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.type || !formData.link) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    try {
      const url = editingResource ? `/api/learningresources/${editingResource._id}` : "/api/learningresources"
      const method = editingResource ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: `Resource ${editingResource ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchResources()
      } else {
        throw new Error("Failed to save resource")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    try {
      const response = await fetch(`/api/learningresources/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Resource deleted successfully",
        })
        fetchResources()
      } else {
        throw new Error("Failed to delete resource")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (resource: LearningResource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      link: resource.link,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "video",
      link: "",
    })
    setEditingResource(null)
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
          <h3 className="text-lg font-medium">Learning Resources</h3>
          <p className="text-sm text-muted-foreground">Manage your learning resources (videos, drive links, etc.)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit" : "Add"} Resource</DialogTitle>
              <DialogDescription>
                {editingResource ? "Update the resource details" : "Add a new learning resource"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Resource title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "video" | "drive") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="drive">Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="Resource link (URL)"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingResource ? "Update" : "Create"} Resource</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <Card key={resource._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <Badge variant={resource.type === "drive" ? "default" : "secondary"}>{resource.type}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>{resource.description}</div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="underline">
                        {resource.link}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(resource._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {resources.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No learning resources added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your learning resources</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LearningResourcesManagement
