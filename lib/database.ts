import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { BaseModel } from "./models"

export class DatabaseService<T extends BaseModel> {
  deleteById(arg0: number) {
      throw new Error("Method not implemented.")
  }
  private collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  async getCollection() {
    const client = await clientPromise
    const db = client.db("dashboard")
    return db.collection<T>(this.collectionName)
  }

  async create(data: Omit<T, "_id" | "createdAt" | "updatedAt">): Promise<T> {
    const collection = await this.getCollection()
    const now = new Date()
    const document = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as T

    const result = await collection.insertOne(document)
    return { ...document, _id: result.insertedId }
  }

  async findAll(): Promise<T[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async findOne(username: string): Promise<T | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ username } as any);
  }

  async findById(id: string): Promise<T | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) } as any)
  }

  async update(id: string, data: Partial<Omit<T, "_id" | "createdAt">>): Promise<T | null> {
    const collection = await this.getCollection()
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: updateData },
      { returnDocument: "after" },
    )

    return result
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any)
    return result.deletedCount === 1
  }
}

// Create service instances for each collection
export const testimonialsService = new DatabaseService<import("./models").Testimonial>("testimonials")
export const experienceService = new DatabaseService<import("./models").Experience>("experience")
export const talksService = new DatabaseService<import("./models").Talk>("talks")
export const publicationsService = new DatabaseService<import("./models").Publication>("publications")
export const patentsService = new DatabaseService<import("./models").Patent>("patents")
export const copyrightsService = new DatabaseService<import("./models").Copyright>("copyrights")
export const startupsService = new DatabaseService<import("./models").Startup>("startups")
export const researchGrantsService = new DatabaseService<import("./models").ResearchGrant>("researchGrants")
export const galleryService = new DatabaseService<import("./models").Gallery>("gallery")
export const phdGuideService = new DatabaseService<import("./models").PhdGuide>("phdguide")
export const learningResourcesService = new DatabaseService<import("./models").LearningResource>("learningresources")
export const loginService = new DatabaseService<import("./models").Login>("login")