import type { ObjectId } from "mongodb"

// Base interface for all models
export interface BaseModel {
  _id?: ObjectId
  createdAt: Date
  updatedAt: Date
}

// Testimonials
export interface Testimonial extends BaseModel {
  image: {
    url: string
    publicId: string
  }
  name: string
  position: string
  paragraph: string
}

// Experience
export interface Experience extends BaseModel {
  startMonth: number
  startYear: number
  endMonth?: number
  endYear?: number
  currentlyWorking: boolean
  position: string
  shortDescription: string
}

// Talks Delivered
export interface Talk extends BaseModel {
  image: {
    url: string
    publicId: string
  }
  name: string
  description: string
  referenceLink?: string
}

// Publications
export interface Publication extends BaseModel {
  name: string
  description: string
  link?: string
  type?: "journal" | "book"
}

// Patents
export interface Patent extends BaseModel {
  type: "National" | "International"
  title: string
  date: Date
  status: string
  number: string
}

// Copyrights
export interface Copyright extends BaseModel {
  title: string
  diaryNumber: string
  copyrightRegOf: string
  status?: string
}

// Startups
export interface Startup extends BaseModel {
  image: {
    url: string
    publicId: string
  }
  title: string
  description: string
}

// Research Grants
export interface ResearchGrant extends BaseModel {
  fundReceived: number
  title: string
  year: number
  grantAgency: string
  currency?: string
  startYear?: number
  endYear?: number
}

// Gallery
export interface Gallery extends BaseModel {
  image: {
    url: string
    publicId: string
  }
  title: string
  shortDescription: string
  location: string
}

// PhD Guide
export interface PhdGuide extends BaseModel {
  supervisor: string
  researchCenter: string
  title: string
  researchScholar: string
  result: string
  declaration: string
}

// Learning Resource
export interface LearningResource extends BaseModel {
  title: string
  description: string
  type: "video" | "drive"
  link: string
}


export interface Login extends BaseModel {
  username: string
  password: string
}