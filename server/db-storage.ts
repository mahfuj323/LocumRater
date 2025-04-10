import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { 
  users, 
  workplaces, 
  agencies, 
  workplaceReviews, 
  agencyReviews, 
  contacts,
  type User, 
  type InsertUser,
  type Workplace,
  type InsertWorkplace,
  type Agency,
  type InsertAgency,
  type WorkplaceReview,
  type InsertWorkplaceReview,
  type AgencyReview,
  type InsertAgencyReview,
  type Contact,
  type InsertContact
} from "@shared/schema";
import { pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Workplace operations
  async getWorkplaces(location?: string, role?: string, rating?: number, facilities?: string): Promise<Workplace[]> {
    let query = db.select().from(workplaces);
    
    if (location) {
      query = query.where(eq(workplaces.city, location));
      // For more advanced search:
      // query = query.where(sql`${workplaces.city} ILIKE ${`%${location}%`}`);
    }
    
    // In a real implementation, we would add more complex filtering based on role, rating, facilities
    // This would require additional schema work for proper filtering
    
    const results = await query;
    return results;
  }

  async getWorkplace(id: number): Promise<Workplace | undefined> {
    const [workplace] = await db.select().from(workplaces).where(eq(workplaces.id, id));
    return workplace;
  }

  async createWorkplace(workplaceData: InsertWorkplace): Promise<Workplace> {
    const [workplace] = await db.insert(workplaces).values(workplaceData).returning();
    return workplace;
  }

  // Agency operations
  async getAgencies(): Promise<Agency[]> {
    const results = await db.select().from(agencies);
    return results;
  }

  async getAgency(id: number): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency;
  }

  async createAgency(agencyData: InsertAgency): Promise<Agency> {
    const [agency] = await db.insert(agencies).values(agencyData).returning();
    return agency;
  }

  // Review operations
  async getWorkplaceReviews(workplaceId: number): Promise<(WorkplaceReview & { user: Partial<User> })[]> {
    const reviews = await db.select().from(workplaceReviews).where(eq(workplaceReviews.workplaceId, workplaceId));
    
    // Fetch user information for each review
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const [user] = await db.select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profession: users.profession
        }).from(users).where(eq(users.id, review.userId));
        
        return {
          ...review,
          user: user || { id: 0, username: "Anonymous", fullName: "Anonymous User", profession: "Unknown" }
        };
      })
    );
    
    return reviewsWithUsers;
  }

  async createWorkplaceReview(reviewData: InsertWorkplaceReview): Promise<WorkplaceReview> {
    const [review] = await db.insert(workplaceReviews).values(reviewData).returning();
    return review;
  }

  async getAgencyReviews(agencyId: number): Promise<(AgencyReview & { user: Partial<User> })[]> {
    const reviews = await db.select().from(agencyReviews).where(eq(agencyReviews.agencyId, agencyId));
    
    // Fetch user information for each review
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const [user] = await db.select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          profession: users.profession
        }).from(users).where(eq(users.id, review.userId));
        
        return {
          ...review,
          user: user || { id: 0, username: "Anonymous", fullName: "Anonymous User", profession: "Unknown" }
        };
      })
    );
    
    return reviewsWithUsers;
  }

  async createAgencyReview(reviewData: InsertAgencyReview): Promise<AgencyReview> {
    const [review] = await db.insert(agencyReviews).values(reviewData).returning();
    return review;
  }

  // Contact operations
  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(contactData).returning();
    return contact;
  }
}