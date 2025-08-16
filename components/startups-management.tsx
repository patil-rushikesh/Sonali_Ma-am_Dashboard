"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ImageUpload } from "@/components/image-upload"
import { Plus, Edit, Trash2, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Startup } from "@/lib/models"

export function StartupsManagement() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: { url: "", publicId: "" },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startups")
      if (response.ok) {
        const data = await response.json()
        setStartups(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch startups",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.image.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingStartup ? `/api/startups/${editingStartup._id}` : "/api/startups"
      const method = editingStartup ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Startup ${editingStartup ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchStartups()
      } else {
        throw new Error("Failed to save startup")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save startup",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this startup?")) return

    try {
      const response = await fetch(`/api/startups/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Startup deleted successfully",
        })
        fetchStartups()
      } else {
        throw new Error("Failed to delete startup")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete startup",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (startup: Startup) => {
    setEditingStartup(startup)
    setFormData({
      title: startup.title,
      description: startup.description,
      image: startup.image,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: { url: "", publicId: "" },
    })
    setEditingStartup(null)
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
          <h3 className="text-lg font-medium">Startups</h3>
          <p className="text-sm text-muted-foreground">Manage your startup ventures and projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStartup ? "Edit" : "Add"} Startup</DialogTitle>
              <DialogDescription>
                {editingStartup ? "Update the startup details" : "Add a new startup venture"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
              <ImageUpload
                onUpload={(result) => setFormData((prev) => ({ ...prev, image: result }))}
                currentImage={formData.image.url}
                folder="startups"
                width={undefined}
                height={undefined}
              />
              <div>
                <Label htmlFor="title" className="mb-1 block text-xs">Startup Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Name of your startup"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="description" className="mb-1 block text-xs">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  rows={2}
                  className="text-sm min-h-[40px]"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={handleDialogClose} className="h-8 px-3 text-sm">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 px-3 text-sm">{editingStartup ? "Update" : "Create"} Startup</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {startups.map((startup) => (
          <Card key={startup._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <img
                src={startup.image.url || "/placeholder.svg"}
                alt={startup.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <CardTitle className="text-base">{startup.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{startup.description}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(startup)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(startup._id?.toString() || "")}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {startups.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No startups added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your startup ventures</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Startup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
