import { 
  User, InsertUser, 
  Workplace, InsertWorkplace, 
  Agency, InsertAgency,
  WorkplaceReview, InsertWorkplaceReview, 
  AgencyReview, InsertAgencyReview,
  Contact, InsertContact
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workplaces: Map<number, Workplace>;
  private agencies: Map<number, Agency>;
  private workplaceReviews: Map<number, WorkplaceReview>;
  private agencyReviews: Map<number, AgencyReview>;
  private contacts: Map<number, Contact>;
  
  private userId: number;
  private workplaceId: number;
  private agencyId: number;
  private workplaceReviewId: number;
  private agencyReviewId: number;
  private contactId: number;
  
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.workplaces = new Map();
    this.agencies = new Map();
    this.workplaceReviews = new Map();
    this.agencyReviews = new Map();
    this.contacts = new Map();
    
    this.userId = 1;
    this.workplaceId = 1;
    this.agencyId = 1;
    this.workplaceReviewId = 1;
    this.agencyReviewId = 1;
    this.contactId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Seed data with sample workplaces and agencies for demonstration
    this.seedData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...userData, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Workplace methods
  async getWorkplaces(location?: string, role?: string, rating?: number, facilities?: string): Promise<Workplace[]> {
    let workplaces = Array.from(this.workplaces.values());
    
    // Apply filters if provided
    if (location) {
      const lowercaseLocation = location.toLowerCase();
      workplaces = workplaces.filter(w => 
        w.city.toLowerCase().includes(lowercaseLocation) || 
        w.postcode.toLowerCase().includes(lowercaseLocation)
      );
    }
    
    if (rating) {
      // Get average ratings for workplaces
      const workplaceRatings = new Map<number, number>();
      
      for (const review of this.workplaceReviews.values()) {
        const currentTotal = workplaceRatings.get(review.workplaceId) || 0;
        const currentCount = workplaceRatings.get(review.workplaceId + 10000) || 0;
        
        workplaceRatings.set(review.workplaceId, currentTotal + review.rating);
        workplaceRatings.set(review.workplaceId + 10000, currentCount + 1);
      }
      
      workplaces = workplaces.filter(w => {
        const totalRating = workplaceRatings.get(w.id) || 0;
        const reviewCount = workplaceRatings.get(w.id + 10000) || 0;
        
        if (reviewCount === 0) return false;
        
        const avgRating = totalRating / reviewCount;
        return avgRating >= rating;
      });
    }
    
    // Filter by role or facilities would require examining reviews
    if (role || facilities) {
      const matchingWorkplaceIds = new Set<number>();
      
      for (const review of this.workplaceReviews.values()) {
        const matchesRole = !role || review.position.toLowerCase() === role.toLowerCase();
        const matchesFacilities = !facilities || (review.facilities && 
          review.facilities.toLowerCase().includes(facilities.toLowerCase()));
        
        if (matchesRole && matchesFacilities) {
          matchingWorkplaceIds.add(review.workplaceId);
        }
      }
      
      workplaces = workplaces.filter(w => matchingWorkplaceIds.has(w.id));
    }
    
    return workplaces;
  }
  
  async getWorkplace(id: number): Promise<Workplace | undefined> {
    return this.workplaces.get(id);
  }
  
  async createWorkplace(workplaceData: InsertWorkplace): Promise<Workplace> {
    const id = this.workplaceId++;
    const createdAt = new Date();
    const workplace: Workplace = { ...workplaceData, id, createdAt };
    this.workplaces.set(id, workplace);
    return workplace;
  }
  
  // Agency methods
  async getAgencies(): Promise<Agency[]> {
    return Array.from(this.agencies.values());
  }
  
  async getAgency(id: number): Promise<Agency | undefined> {
    return this.agencies.get(id);
  }
  
  async createAgency(agencyData: InsertAgency): Promise<Agency> {
    const id = this.agencyId++;
    const createdAt = new Date();
    const agency: Agency = { ...agencyData, id, createdAt };
    this.agencies.set(id, agency);
    return agency;
  }
  
  // Review methods
  async getWorkplaceReviews(workplaceId: number): Promise<(WorkplaceReview & { user: Partial<User> })[]> {
    const reviews = Array.from(this.workplaceReviews.values())
      .filter(review => review.workplaceId === workplaceId);
    
    // Add user info to each review
    return reviews.map(review => {
      const user = this.users.get(review.userId);
      return {
        ...review,
        user: user ? { id: user.id, username: user.username, profession: user.profession } : { id: 0, username: "Unknown User", profession: "Unknown" }
      };
    });
  }
  
  async createWorkplaceReview(reviewData: InsertWorkplaceReview): Promise<WorkplaceReview> {
    const id = this.workplaceReviewId++;
    const createdAt = new Date();
    const review: WorkplaceReview = { ...reviewData, id, createdAt };
    this.workplaceReviews.set(id, review);
    return review;
  }
  
  async getAgencyReviews(agencyId: number): Promise<(AgencyReview & { user: Partial<User> })[]> {
    const reviews = Array.from(this.agencyReviews.values())
      .filter(review => review.agencyId === agencyId);
    
    // Add user info to each review
    return reviews.map(review => {
      const user = this.users.get(review.userId);
      return {
        ...review,
        user: user ? { id: user.id, username: user.username, profession: user.profession } : { id: 0, username: "Unknown User", profession: "Unknown" }
      };
    });
  }
  
  async createAgencyReview(reviewData: InsertAgencyReview): Promise<AgencyReview> {
    const id = this.agencyReviewId++;
    const createdAt = new Date();
    const review: AgencyReview = { ...reviewData, id, createdAt };
    this.agencyReviews.set(id, review);
    return review;
  }
  
  // Contact methods
  async createContact(contactData: InsertContact): Promise<Contact> {
    const id = this.contactId++;
    const createdAt = new Date();
    const contact: Contact = { ...contactData, id, createdAt };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Seed initial data
  private seedData() {
    // Sample workplaces
    const workplace1: Workplace = {
      id: this.workplaceId++,
      name: "City Centre Pharmacy",
      city: "Manchester",
      postcode: "M1 1AA",
      address: "123 Main Street",
      type: "pharmacy",
      phone: "0161 123 4567",
      createdBy: 0,
      createdAt: new Date()
    };
    
    const workplace2: Workplace = {
      id: this.workplaceId++,
      name: "Vision Care Clinic",
      city: "Leeds",
      postcode: "LS1 1BB",
      address: "456 High Street",
      type: "optometry",
      phone: "0113 987 6543",
      createdBy: 0,
      createdAt: new Date()
    };
    
    const workplace3: Workplace = {
      id: this.workplaceId++,
      name: "Healthcare Plus",
      city: "Birmingham",
      postcode: "B1 1CC",
      address: "789 New Road",
      type: "pharmacy",
      phone: "0121 456 7890",
      createdBy: 0,
      createdAt: new Date()
    };
    
    this.workplaces.set(workplace1.id, workplace1);
    this.workplaces.set(workplace2.id, workplace2);
    this.workplaces.set(workplace3.id, workplace3);
    
    // Sample agencies
    const agency1: Agency = {
      id: this.agencyId++,
      name: "Locum Connect",
      location: "London",
      createdBy: 0,
      createdAt: new Date()
    };
    
    const agency2: Agency = {
      id: this.agencyId++,
      name: "Healthcare Professionals",
      location: "Manchester",
      createdBy: 0,
      createdAt: new Date()
    };
    
    const agency3: Agency = {
      id: this.agencyId++,
      name: "Pharmacy Locums UK",
      location: "Birmingham",
      createdBy: 0,
      createdAt: new Date()
    };
    
    this.agencies.set(agency1.id, agency1);
    this.agencies.set(agency2.id, agency2);
    this.agencies.set(agency3.id, agency3);
  }
}

// Create and export storage instance
export const storage = new MemStorage();
