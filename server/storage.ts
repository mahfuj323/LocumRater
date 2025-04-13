import { 
  User, InsertUser, 
  Workplace, InsertWorkplace, 
  Agency, InsertAgency,
  WorkplaceReview, InsertWorkplaceReview, 
  AgencyReview, InsertAgencyReview,
  Contact, InsertContact,
  FaqQuestion, InsertFaqQuestion
} from "@shared/schema";
import session from "express-session";
import { DatabaseStorage } from "./db-storage";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workplace operations
  getWorkplaces(location?: string, role?: string, rating?: number, facilities?: string): Promise<Workplace[]>;
  getWorkplace(id: number): Promise<Workplace | undefined>;
  createWorkplace(workplace: InsertWorkplace): Promise<Workplace>;
  
  // Agency operations
  getAgencies(): Promise<Agency[]>;
  getAgency(id: number): Promise<Agency | undefined>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  
  // Review operations
  getWorkplaceReviews(workplaceId: number): Promise<(WorkplaceReview & { user: Partial<User> })[]>;
  createWorkplaceReview(review: InsertWorkplaceReview): Promise<WorkplaceReview>;
  getAgencyReviews(agencyId: number): Promise<(AgencyReview & { user: Partial<User> })[]>;
  createAgencyReview(review: InsertAgencyReview): Promise<AgencyReview>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  
  // FAQ Questions operations
  createFaqQuestion(question: InsertFaqQuestion): Promise<FaqQuestion>;
  
  // Session store
  sessionStore: session.Store;
}

// The MemStorage implementation has been removed as it's no longer used
// We're now using the DatabaseStorage implementation from ./db-storage.ts

// Create and export storage instance
// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
