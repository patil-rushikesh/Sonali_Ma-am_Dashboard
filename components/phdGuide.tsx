"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PhdGuideEntry = {
  _id?: string;
  supervisor: string;
  researchCenter: string;
  title: string;
  researchScholar: string;
  result: string;
  declaration: string;
};

const initialForm = {
  supervisor: "",
  researchCenter: "",
  title: "",
  researchScholar: "",
  result: "",
  declaration: "",
};

const fetchPhdGuideEntries = async (): Promise<PhdGuideEntry[]> => {
  const res = await fetch("/api/phdguide");
  if (res.ok) return res.json();
  return [];
};

const createPhdGuideEntry = async (entry: PhdGuideEntry) => {
  return fetch("/api/phdguide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
};

const updatePhdGuideEntry = async (id: string, entry: PhdGuideEntry) => {
  // Use PUT to /api/phdguide with id in body
//   console.log("Updating PhD guide entry with ID:", id, "Data:", entry);
  return fetch("/api/phdguide", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...entry }),
  });
};

const deletePhdGuideEntry = async (id: string) => {
  // Use DELETE to /api/phdguide with id in body
  return fetch("/api/phdguide", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
};

const PhdGuideForm = () => {
  const [entries, setEntries] = useState<PhdGuideEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PhdGuideEntry | null>(null);
  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await fetchPhdGuideEntries();
      setEntries(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setForm(initialForm);
  };

  const handleEdit = (entry: PhdGuideEntry) => {
    setEditingEntry(entry);
    setForm({
      supervisor: entry.supervisor,
      researchCenter: entry.researchCenter,
      title: entry.title,
      researchScholar: entry.researchScholar,
      result: entry.result,
      declaration: entry.declaration,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deletePhdGuideEntry(id);
      toast({ title: "Success", description: "Entry deleted" });
      loadEntries();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEntry && editingEntry._id) {
        await updatePhdGuideEntry(editingEntry._id, form);
        toast({ title: "Success", description: "Entry updated" });
      } else {
        await createPhdGuideEntry(form);
        toast({ title: "Success", description: "Entry created" });
      }
      handleDialogClose();
      loadEntries();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save entry",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">PhD Guide</h3>
          <p className="text-sm text-muted-foreground">
            Manage Supervisor, Research Center, Title, Scholar, Result, Declaration
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit" : "Add"} PhD Guide Entry</DialogTitle>
              <DialogDescription>
                {editingEntry ? "Update the entry details" : "Add a new PhD guide entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input
                    id="supervisor"
                    value={form.supervisor}
                    onChange={e => setForm(f => ({ ...f, supervisor: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="researchCenter">Research Center</Label>
                  <Input
                    id="researchCenter"
                    value={form.researchCenter}
                    onChange={e => setForm(f => ({ ...f, researchCenter: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="researchScholar">Research Scholar</Label>
                  <Input
                    id="researchScholar"
                    value={form.researchScholar}
                    onChange={e => setForm(f => ({ ...f, researchScholar: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="result">Result</Label>
                  <Input
                    id="result"
                    value={form.result}
                    onChange={e => setForm(f => ({ ...f, result: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="declaration">Declaration</Label>
                <Input
                  id="declaration"
                  value={form.declaration}
                  onChange={e => setForm(f => ({ ...f, declaration: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">{editingEntry ? "Update" : "Create"} Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Supervisor: {entry.supervisor}</div>
                    <div>Research Center: {entry.researchCenter}</div>
                    <div>Research Scholar: {entry.researchScholar}</div>
                    <div>Result: {entry.result}</div>
                    <div>Declaration: {entry.declaration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(entry._id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No entries added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your PhD guide entries</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhdGuideForm;