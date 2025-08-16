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
import { Plus, Edit, Trash2, ImageIcon, MapPin, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Gallery } from "@/lib/models"

export function GalleryManagement() {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Gallery | null>(null)
  const [viewingItem, setViewingItem] = useState<Gallery | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    location: "",
    image: { url: "", publicId: "" },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      if (response.ok) {
        const data = await response.json()
        setGallery(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.shortDescription || !formData.location || !formData.image.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingItem ? `/api/gallery/${editingItem._id}` : "/api/gallery"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Gallery item ${editingItem ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchGallery()
      } else {
        throw new Error("Failed to save gallery item")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Gallery item deleted successfully",
        })
        fetchGallery()
      } else {
        throw new Error("Failed to delete gallery item")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: Gallery) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      shortDescription: item.shortDescription,
      location: item.location,
      image: item.image,
    })
    setDialogOpen(true)
  }

  const handleView = (item: Gallery) => {
    setViewingItem(item)
    setViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      location: "",
      image: { url: "", publicId: "" },
    })
    setEditingItem(null)
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
          <h3 className="text-lg font-medium">Gallery</h3>
          <p className="text-sm text-muted-foreground">Manage your image gallery and photo collections</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Gallery Image</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the image details" : "Add a new image to your gallery"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                onUpload={(result) => setFormData((prev) => ({ ...prev, image: result }))}
                currentImage={formData.image.url}
                folder="gallery"
                width={800}
                height={600}
              />
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Image title"
                />
              </div>
              <div>
                <Label htmlFor="shortDescription">Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description of the image"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Where was this photo taken?"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update" : "Add"} Image</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <Card
            key={item._id?.toString()}
            className="group transition-all duration-200 hover:shadow-lg overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image.url || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={() => handleView(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium line-clamp-1">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.shortDescription}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{item.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1 bg-transparent"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs flex-1 bg-transparent"
                  onClick={() => handleDelete(item._id?.toString() || "")}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gallery.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No images in gallery yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first image to the gallery</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingItem?.title}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={viewingItem.image.url || "/placeholder.svg"}
                  alt={viewingItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{viewingItem.shortDescription}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{viewingItem.location}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
