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
import { Plus, Edit, Trash2, Copyright } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Copyright as CopyrightType } from "@/lib/models"

export function CopyrightsManagement() {
  const [copyrights, setCopyrights] = useState<CopyrightType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCopyright, setEditingCopyright] = useState<CopyrightType | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    diaryNumber: "",
    copyrightRegOf: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCopyrights()
  }, [])

  const fetchCopyrights = async () => {
    try {
      const response = await fetch("/api/copyrights")
      if (response.ok) {
        const data = await response.json()
        setCopyrights(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch copyrights",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.diaryNumber || !formData.copyrightRegOf) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingCopyright ? `/api/copyrights/${editingCopyright._id}` : "/api/copyrights"
      const method = editingCopyright ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Copyright ${editingCopyright ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchCopyrights()
      } else {
        throw new Error("Failed to save copyright")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save copyright",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this copyright?")) return

    try {
      const response = await fetch(`/api/copyrights/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Copyright deleted successfully",
        })
        fetchCopyrights()
      } else {
        throw new Error("Failed to delete copyright")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete copyright",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (copyright: CopyrightType) => {
    setEditingCopyright(copyright)
    setFormData({
      title: copyright.title,
      diaryNumber: copyright.diaryNumber,
      copyrightRegOf: copyright.copyrightRegOf,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      diaryNumber: "",
      copyrightRegOf: "",
    })
    setEditingCopyright(null)
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
          <h3 className="text-lg font-medium">Copyrights</h3>
          <p className="text-sm text-muted-foreground">Manage your copyright registrations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Copyright
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCopyright ? "Edit" : "Add"} Copyright</DialogTitle>
              <DialogDescription>
                {editingCopyright ? "Update the copyright details" : "Add a new copyright registration"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Copyright title"
                />
              </div>
              <div>
                <Label htmlFor="diaryNumber">Diary Number</Label>
                <Input
                  id="diaryNumber"
                  value={formData.diaryNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diaryNumber: e.target.value }))}
                  placeholder="Copyright diary number"
                />
              </div>
              <div>
                <Label htmlFor="copyrightRegOf">Copyright Registration Of</Label>
                <Input
                  id="copyrightRegOf"
                  value={formData.copyrightRegOf}
                  onChange={(e) => setFormData((prev) => ({ ...prev, copyrightRegOf: e.target.value }))}
                  placeholder="What the copyright is registered for"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingCopyright ? "Update" : "Create"} Copyright</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {copyrights.map((copyright) => (
          <Card key={copyright._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{copyright.title}</CardTitle>
                  <div className="space-y-1 text-sm text-muted-foreground mt-2">
                    <div>Diary Number: {copyright.diaryNumber}</div>
                    <div>Registration Of: {copyright.copyrightRegOf}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(copyright)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(copyright._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {copyrights.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Copyright className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No copyrights added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your copyright registrations</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Copyright
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
