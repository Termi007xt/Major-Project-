import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  skills: text("skills").array(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 4 }),
  successRate: integer("success_rate").default(0),
  completedProjects: integer("completed_projects").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  isFreelancer: boolean("is_freelancer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  freelancerId: varchar("freelancer_id").references(() => users.id),
  totalBudget: decimal("total_budget", { precision: 10, scale: 4 }).notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, completed, cancelled
  category: text("category"),
  tags: text("tags").array(),
  deadline: timestamp("deadline"),
  smartContractAddress: text("smart_contract_address"),
  escrowStatus: text("escrow_status").default("pending"), // pending, funded, released
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectModules = pgTable("project_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 10, scale: 4 }).notNull(),
  deadline: timestamp("deadline"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  priority: text("priority").default("medium"), // low, medium, high
  progress: integer("progress").default(0), // 0-100
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const smartContracts = pgTable("smart_contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  terms: jsonb("terms").notNull(),
  paymentSchedule: text("payment_schedule").notNull(),
  revisionRounds: integer("revision_rounds").default(3),
  cancellationTerms: text("cancellation_terms"),
  qualityStandards: text("quality_standards"),
  disputeResolution: text("dispute_resolution").default("community_arbitration"),
  platformFee: decimal("platform_fee", { precision: 5, scale: 2 }).default("2.5"),
  gasFeeResponsibility: text("gas_fee_responsibility").default("split"),
  autoReleaseAfterDays: integer("auto_release_after_days").default(7),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  freelancerId: varchar("freelancer_id").references(() => users.id).notNull(),
  coverLetter: text("cover_letter").notNull(),
  proposedBudget: decimal("proposed_budget", { precision: 10, scale: 4 }).notNull(),
  proposedDeadline: timestamp("proposed_deadline"),
  status: text("status").default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  fileAttachment: text("file_attachment"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  moduleId: varchar("module_id").references(() => projectModules.id),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  status: text("status").default("pending"), // pending, completed, paid
  completedAt: timestamp("completed_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectModuleSchema = createInsertSchema(projectModules).omit({
  id: true,
  createdAt: true,
});

export const insertSmartContractSchema = createInsertSchema(smartContracts).omit({
  id: true,
  createdAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectModule = typeof projectModules.$inferSelect;
export type InsertProjectModule = z.infer<typeof insertProjectModuleSchema>;
export type SmartContract = typeof smartContracts.$inferSelect;
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
