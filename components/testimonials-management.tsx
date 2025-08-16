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
import { ImageUpload } from "@/components/image-upload"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Testimonial } from "@/lib/models"

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    paragraph: "",
    image: { url: "", publicId: "" },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.position || !formData.paragraph || !formData.image.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial._id}` : "/api/testimonials"
      const method = editingTestimonial ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Testimonial ${editingTestimonial ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchTestimonials()
      } else {
        throw new Error("Failed to save testimonial")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
        fetchTestimonials()
      } else {
        throw new Error("Failed to delete testimonial")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      paragraph: testimonial.paragraph,
      image: testimonial.image,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      paragraph: "",
      image: { url: "", publicId: "" },
    })
    setEditingTestimonial(null)
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
          <h3 className="text-lg font-medium">Testimonials</h3>
          <p className="text-sm text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit" : "Add"} Testimonial</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? "Update the testimonial details" : "Add a new client testimonial"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                onUpload={(result) => setFormData((prev) => ({ ...prev, image: result }))}
                currentImage={formData.image.url}
                folder="testimonials"
                width={400}
                height={400}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="Job title or position"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paragraph">Testimonial</Label>
                <Textarea
                  id="paragraph"
                  value={formData.paragraph}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paragraph: e.target.value }))}
                  placeholder="Client testimonial text"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingTestimonial ? "Update" : "Create"} Testimonial</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image.url || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-base">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.position}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">"{testimonial.paragraph}"</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial._id?.toString() || "")}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No testimonials yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first client testimonial</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
