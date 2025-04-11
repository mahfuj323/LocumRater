import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContactSchema, insertWorkplaceSchema, insertAgencySchema, 
         insertWorkplaceReviewSchema, insertAgencyReviewSchema, insertFaqQuestionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Middleware for validating request body with Zod schema
  const validateBody = (schema: any) => (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  };

  // Contact form submission
  app.post("/api/contact", validateBody(insertContactSchema), async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Workplace routes
  app.get("/api/workplaces", async (req, res) => {
    try {
      const { location, role, rating, facilities } = req.query;
      const workplaces = await storage.getWorkplaces(location as string, role as string, 
                                                     Number(rating), facilities as string);
      
      // For non-authenticated users, return limited data
      if (!req.isAuthenticated()) {
        const limitedWorkplaces = workplaces.slice(0, 3);
        return res.json({ workplaces: limitedWorkplaces, isLimited: true });
      }
      
      res.json({ workplaces, isLimited: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workplaces" });
    }
  });

  app.get("/api/workplaces/:id", async (req, res) => {
    try {
      const workplace = await storage.getWorkplace(parseInt(req.params.id));
      if (!workplace) {
        return res.status(404).json({ message: "Workplace not found" });
      }
      
      const reviews = await storage.getWorkplaceReviews(workplace.id);
      
      // For non-authenticated users, return limited reviews
      if (!req.isAuthenticated() && reviews.length > 3) {
        return res.json({ 
          workplace, 
          reviews: reviews.slice(0, 3), 
          totalReviews: reviews.length,
          isLimited: true 
        });
      }
      
      res.json({ workplace, reviews, totalReviews: reviews.length, isLimited: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workplace details" });
    }
  });

  app.post("/api/workplaces", isAuthenticated, validateBody(insertWorkplaceSchema), async (req, res) => {
    try {
      const workplace = await storage.createWorkplace({
        ...req.body,
        createdBy: req.user!.id
      });
      res.status(201).json(workplace);
    } catch (error) {
      res.status(500).json({ message: "Failed to create workplace" });
    }
  });

  // Agency routes
  app.get("/api/agencies", async (req, res) => {
    try {
      const agencies = await storage.getAgencies();
      
      // For non-authenticated users, return limited data
      if (!req.isAuthenticated()) {
        const limitedAgencies = agencies.slice(0, 3);
        return res.json({ agencies: limitedAgencies, isLimited: true });
      }
      
      res.json({ agencies, isLimited: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agencies" });
    }
  });

  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const agency = await storage.getAgency(parseInt(req.params.id));
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      
      const reviews = await storage.getAgencyReviews(agency.id);
      
      // For non-authenticated users, return limited reviews
      if (!req.isAuthenticated() && reviews.length > 3) {
        return res.json({ 
          agency, 
          reviews: reviews.slice(0, 3), 
          totalReviews: reviews.length,
          isLimited: true 
        });
      }
      
      res.json({ agency, reviews, totalReviews: reviews.length, isLimited: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agency details" });
    }
  });

  app.post("/api/agencies", isAuthenticated, validateBody(insertAgencySchema), async (req, res) => {
    try {
      const agency = await storage.createAgency({
        ...req.body,
        createdBy: req.user!.id
      });
      res.status(201).json(agency);
    } catch (error) {
      res.status(500).json({ message: "Failed to create agency" });
    }
  });

  // Review routes
  app.post("/api/workplaces/:id/reviews", isAuthenticated, validateBody(insertWorkplaceReviewSchema), 
    async (req, res) => {
      try {
        const workplace = await storage.getWorkplace(parseInt(req.params.id));
        if (!workplace) {
          return res.status(404).json({ message: "Workplace not found" });
        }
        
        const review = await storage.createWorkplaceReview({
          ...req.body,
          workplaceId: workplace.id,
          userId: req.user!.id
        });
        
        res.status(201).json(review);
      } catch (error) {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  );

  app.post("/api/agencies/:id/reviews", isAuthenticated, validateBody(insertAgencyReviewSchema), 
    async (req, res) => {
      try {
        const agency = await storage.getAgency(parseInt(req.params.id));
        if (!agency) {
          return res.status(404).json({ message: "Agency not found" });
        }
        
        const review = await storage.createAgencyReview({
          ...req.body,
          agencyId: agency.id,
          userId: req.user!.id
        });
        
        res.status(201).json(review);
      } catch (error) {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  );

  // FAQ Question submission
  app.post("/api/faq/questions", validateBody(insertFaqQuestionSchema), async (req, res) => {
    try {
      const question = await storage.createFaqQuestion({
        ...req.body,
        anonymous: !!req.body.anonymous // Ensure boolean
      });
      res.status(201).json({ message: "Question submitted successfully", id: question.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
