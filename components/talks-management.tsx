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
import { Plus, Edit, Trash2, Mic, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Talk } from "@/lib/models"

export function TalksManagement() {
  const [talks, setTalks] = useState<Talk[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTalk, setEditingTalk] = useState<Talk | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    referenceLink: "",
    image: { url: "", publicId: "" },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTalks()
  }, [])

  const fetchTalks = async () => {
    try {
      const response = await fetch("/api/talks")
      if (response.ok) {
        const data = await response.json()
        setTalks(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch talks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.image.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingTalk ? `/api/talks/${editingTalk._id}` : "/api/talks"
      const method = editingTalk ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Talk ${editingTalk ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchTalks()
      } else {
        throw new Error("Failed to save talk")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save talk",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this talk?")) return

    try {
      const response = await fetch(`/api/talks/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Talk deleted successfully",
        })
        fetchTalks()
      } else {
        throw new Error("Failed to delete talk")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete talk",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (talk: Talk) => {
    setEditingTalk(talk)
    setFormData({
      name: talk.name,
      description: talk.description,
      referenceLink: talk.referenceLink || "",
      image: talk.image,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      referenceLink: "",
      image: { url: "", publicId: "" },
    })
    setEditingTalk(null)
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
          <h3 className="text-lg font-medium">Talks Delivered</h3>
          <p className="text-sm text-muted-foreground">Manage your speaking engagements and presentations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Talk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTalk ? "Edit" : "Add"} Talk</DialogTitle>
              <DialogDescription>
                {editingTalk ? "Update the talk details" : "Add a new speaking engagement"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-2">
              <ImageUpload
                onUpload={(result) => setFormData((prev) => ({ ...prev, image: result }))}
                currentImage={formData.image.url}
                folder="talks"
                width={600}
                height={400}
              />
              <div>
                <Label htmlFor="name" className="mb-1 block text-xs">Talk Title</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Title"
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
              <div>
                <Label htmlFor="referenceLink" className="mb-1 block text-xs">Reference Link (Optional)</Label>
                <Input
                  id="referenceLink"
                  type="url"
                  value={formData.referenceLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, referenceLink: e.target.value }))}
                  placeholder="https://example.com"
                  className="h-8 text-sm"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={handleDialogClose} className="h-8 px-3 text-sm">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 px-3 text-sm">{editingTalk ? "Update" : "Create"} Talk</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talks.map((talk) => (
          <Card key={talk._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <img
                src={talk.image.url || "/placeholder.svg"}
                alt={talk.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <CardTitle className="text-base">{talk.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{talk.description}</p>
              {talk.referenceLink && (
                <div className="mb-4">
                  <a
                    href={talk.referenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Reference
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(talk)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(talk._id?.toString() || "")}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {talks.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No talks added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your speaking engagements</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Talk
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
