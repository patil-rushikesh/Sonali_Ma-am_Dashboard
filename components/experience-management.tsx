"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, Edit, Trash2, Briefcase, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Experience } from "@/lib/models"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

export function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    startMonth: 1,
    startYear: currentYear,
    endMonth: 1,
    endYear: currentYear,
    currentlyWorking: false,
    position: "",
    shortDescription: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience")
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.position || !formData.shortDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingExperience ? `/api/experience/${editingExperience._id}` : "/api/experience"
      const method = editingExperience ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Experience ${editingExperience ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchExperiences()
      } else {
        throw new Error("Failed to save experience")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      const response = await fetch(`/api/experience/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        })
        fetchExperiences()
      } else {
        throw new Error("Failed to delete experience")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData({
      startMonth: experience.startMonth,
      startYear: experience.startYear,
      endMonth: experience.endMonth || 1,
      endYear: experience.endYear || currentYear,
      currentlyWorking: experience.currentlyWorking,
      position: experience.position,
      shortDescription: experience.shortDescription,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      startMonth: 1,
      startYear: currentYear,
      endMonth: 1,
      endYear: currentYear,
      currentlyWorking: false,
      position: "",
      shortDescription: "",
    })
    setEditingExperience(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  const formatDateRange = (experience: Experience) => {
    const startDate = `${months[experience.startMonth - 1]} ${experience.startYear}`
    if (experience.currentlyWorking) {
      return `${startDate} - Present`
    }
    const endDate = `${months[(experience.endMonth || 1) - 1]} ${experience.endYear}`
    return `${startDate} - ${endDate}`
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Experience</h3>
          <p className="text-sm text-muted-foreground">Manage your work experience timeline</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExperience ? "Edit" : "Add"} Experience</DialogTitle>
              <DialogDescription>
                {editingExperience ? "Update the experience details" : "Add a new work experience"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder="Job title or position"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.startMonth.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, startMonth: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.startYear.toString()}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, startYear: Number.parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>End Date</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.endMonth.toString()}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, endMonth: Number.parseInt(value) }))}
                      disabled={formData.currentlyWorking}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.endYear.toString()}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, endYear: Number.parseInt(value) }))}
                      disabled={formData.currentlyWorking}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="currentlyWorking"
                  checked={formData.currentlyWorking}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, currentlyWorking: checked as boolean }))
                  }
                />
                <Label htmlFor="currentlyWorking">Currently working here</Label>
              </div>

              <div>
                <Label htmlFor="shortDescription">Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description of your role and responsibilities"
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingExperience ? "Update" : "Create"} Experience</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience._id?.toString()} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{experience.position}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {formatDateRange(experience)}
                    {experience.currentlyWorking && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(experience)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(experience._id?.toString() || "")}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{experience.shortDescription}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No experience added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your work experience</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
