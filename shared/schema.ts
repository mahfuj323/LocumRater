import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  profession: text("profession").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  profession: true,
});

// Workplace schema
export const workplaces = pgTable("workplaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(),
  phone: text("phone"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkplaceSchema = createInsertSchema(workplaces).pick({
  name: true,
  city: true,
  postcode: true,
  address: true,
  type: true,
  phone: true,
  createdBy: true,
});

// Agency schema
export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgencySchema = createInsertSchema(agencies).pick({
  name: true,
  location: true,
  createdBy: true,
});

// Workplace Review schema
export const workplaceReviews = pgTable("workplace_reviews", {
  id: serial("id").primaryKey(),
  workplaceId: integer("workplace_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  position: text("position").notNull(),
  payRate: doublePrecision("pay_rate").notNull(),
  paymentTime: integer("payment_time").notNull(),
  transport: text("transport").notNull(),
  facilities: text("facilities"),
  comments: text("comments").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkplaceReviewSchema = createInsertSchema(workplaceReviews).pick({
  workplaceId: true,
  userId: true,
  rating: true,
  position: true,
  payRate: true,
  paymentTime: true,
  transport: true,
  facilities: true,
  comments: true,
});

// Agency Review schema
export const agencyReviews = pgTable("agency_reviews", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  payRates: text("pay_rates"),
  paymentReliability: text("payment_reliability").notNull(),
  communication: text("communication").notNull(),
  comments: text("comments").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgencyReviewSchema = createInsertSchema(agencyReviews).pick({
  agencyId: true,
  userId: true,
  rating: true,
  payRates: true,
  paymentReliability: true,
  communication: true,
  comments: true,
});

// Contact schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workplaceReviews: many(workplaceReviews),
  agencyReviews: many(agencyReviews),
  workplaces: many(workplaces, { relationName: "created_workplaces" }),
  agencies: many(agencies, { relationName: "created_agencies" }),
}));

export const workplacesRelations = relations(workplaces, ({ one, many }) => ({
  creator: one(users, {
    fields: [workplaces.createdBy],
    references: [users.id],
    relationName: "created_workplaces",
  }),
  reviews: many(workplaceReviews),
}));

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  creator: one(users, {
    fields: [agencies.createdBy],
    references: [users.id],
    relationName: "created_agencies",
  }),
  reviews: many(agencyReviews),
}));

export const workplaceReviewsRelations = relations(workplaceReviews, ({ one }) => ({
  workplace: one(workplaces, {
    fields: [workplaceReviews.workplaceId],
    references: [workplaces.id],
  }),
  user: one(users, {
    fields: [workplaceReviews.userId],
    references: [users.id],
  }),
}));

export const agencyReviewsRelations = relations(agencyReviews, ({ one }) => ({
  agency: one(agencies, {
    fields: [agencyReviews.agencyId],
    references: [agencies.id],
  }),
  user: one(users, {
    fields: [agencyReviews.userId],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Workplace = typeof workplaces.$inferSelect;
export type InsertWorkplace = z.infer<typeof insertWorkplaceSchema>;

export type Agency = typeof agencies.$inferSelect;
export type InsertAgency = z.infer<typeof insertAgencySchema>;

export type WorkplaceReview = typeof workplaceReviews.$inferSelect;
export type InsertWorkplaceReview = z.infer<typeof insertWorkplaceReviewSchema>;

export type AgencyReview = typeof agencyReviews.$inferSelect;
export type InsertAgencyReview = z.infer<typeof insertAgencyReviewSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
