import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type ProjectModule,
  type InsertProjectModule,
  type SmartContract,
  type InsertSmartContract,
  type Proposal,
  type InsertProposal,
  type Message,
  type InsertMessage,
  type Milestone,
  type InsertMilestone,
  users,
  projects,
  projectModules,
  smartContracts,
  proposals,
  messages,
  milestones
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getFreelancers(): Promise<User[]>;

  // Project methods
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  getProjectsByFreelancer(freelancerId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;

  // Project module methods
  getProjectModules(projectId: string): Promise<ProjectModule[]>;
  createProjectModule(module: InsertProjectModule): Promise<ProjectModule>;
  updateProjectModule(id: string, updates: Partial<ProjectModule>): Promise<ProjectModule | undefined>;

  // Smart contract methods
  getSmartContract(projectId: string): Promise<SmartContract | undefined>;
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  updateSmartContract(id: string, updates: Partial<SmartContract>): Promise<SmartContract | undefined>;

  // Proposal methods
  getProposals(projectId: string): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Message methods
  getMessages(senderId: string, receiverId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;

  // Milestone methods
  getMilestones(projectId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample data on startup
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    try {
      // Check if data already exists
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) return;

      // Create sample users
      await db.insert(users).values([
        {
          id: "client-1",
          username: "techstartup",
          email: "client@techstartup.com",
          walletAddress: "0x1234567890abcdef",
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
          bio: "Tech startup looking for quality developers",
          skills: [],
          hourlyRate: null,
          successRate: 95,
          completedProjects: 12,
          rating: "4.8",
          totalReviews: 15,
          isFreelancer: false,
        },
        {
          id: "freelancer-1",
          username: "alexrodriguez",
          email: "alex@freelancer.com",
          walletAddress: "0xabcdef1234567890",
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
          bio: "Full-stack developer with 5+ years experience",
          skills: ["React", "Node.js", "Solidity", "Web3.js"],
          hourlyRate: "0.15",
          successRate: 98,
          completedProjects: 156,
          rating: "4.9",
          totalReviews: 47,
          isFreelancer: true,
        },
        {
          id: "freelancer-2",
          username: "sarahchen",
          email: "sarah@security.com",
          walletAddress: "0xfedcba0987654321",
          profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
          bio: "Blockchain security expert and smart contract auditor",
          skills: ["Solidity", "Security Audit", "Vyper", "Formal Verification"],
          hourlyRate: "0.25",
          successRate: 100,
          completedProjects: 201,
          rating: "5.0",
          totalReviews: 73,
          isFreelancer: true,
        }
      ]);

      // Create sample projects
      await db.insert(projects).values([
        {
          id: "project-1",
          title: "E-commerce Mobile App Development",
          description: "Build a modern e-commerce mobile application with blockchain integration",
          clientId: "client-1",
          freelancerId: "freelancer-1",
          totalBudget: "5.5",
          status: "in_progress",
          category: "Mobile Development",
          tags: ["React Native", "E-commerce", "Blockchain"],
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          smartContractAddress: "0xabc123def456",
          escrowStatus: "funded",
        },
        {
          id: "project-2",
          title: "Smart Contract Audit & Security Review",
          description: "Comprehensive security audit of DeFi smart contracts",
          clientId: "client-1",
          freelancerId: "freelancer-2",
          totalBudget: "3.2",
          status: "completed",
          category: "Security",
          tags: ["Smart Contracts", "Security", "Audit"],
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          smartContractAddress: "0xdef456abc789",
          escrowStatus: "released",
        }
      ]);

      // Create sample modules
      await db.insert(projectModules).values([
        {
          id: "module-1",
          projectId: "project-1",
          name: "UI/UX Design",
          description: "Create user interface designs and user experience flows",
          budget: "1.5",
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: "completed",
          priority: "high",
          progress: 100,
          order: 1,
        },
        {
          id: "module-2",
          projectId: "project-1",
          name: "Frontend Development",
          description: "Implement the user interface using React Native",
          budget: "2.5",
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: "in_progress",
          priority: "high",
          progress: 65,
          order: 2,
        },
        {
          id: "module-3",
          projectId: "project-1",
          name: "Backend API",
          description: "Develop RESTful API and blockchain integration",
          budget: "1.5",
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          status: "pending",
          priority: "medium",
          progress: 0,
          order: 3,
        }
      ]);

      // Create sample messages
      await db.insert(messages).values([
        {
          id: "msg-1",
          projectId: "project-1",
          senderId: "freelancer-1",
          receiverId: "client-1",
          content: "I've completed the UI mockups for review",
          fileAttachment: null,
          isRead: false,
        },
        {
          id: "msg-2",
          projectId: "project-2",
          senderId: "freelancer-2",
          receiverId: "client-1",
          content: "Security audit report is ready for your review",
          fileAttachment: null,
          isRead: true,
        }
      ]);

      console.log("Database initialized with sample data");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getFreelancers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isFreelancer, true));
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.clientId, clientId));
  }

  async getProjectsByFreelancer(freelancerId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.freelancerId, freelancerId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db.update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  // Project module methods
  async getProjectModules(projectId: string): Promise<ProjectModule[]> {
    return await db.select()
      .from(projectModules)
      .where(eq(projectModules.projectId, projectId))
      .orderBy(projectModules.order);
  }

  async createProjectModule(insertModule: InsertProjectModule): Promise<ProjectModule> {
    const [module] = await db.insert(projectModules).values(insertModule).returning();
    return module;
  }

  async updateProjectModule(id: string, updates: Partial<ProjectModule>): Promise<ProjectModule | undefined> {
    const [module] = await db.update(projectModules)
      .set(updates)
      .where(eq(projectModules.id, id))
      .returning();
    return module || undefined;
  }

  // Smart contract methods
  async getSmartContract(projectId: string): Promise<SmartContract | undefined> {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.projectId, projectId));
    return contract || undefined;
  }

  async createSmartContract(insertContract: InsertSmartContract): Promise<SmartContract> {
    const [contract] = await db.insert(smartContracts).values(insertContract).returning();
    return contract;
  }

  async updateSmartContract(id: string, updates: Partial<SmartContract>): Promise<SmartContract | undefined> {
    const [contract] = await db.update(smartContracts)
      .set(updates)
      .where(eq(smartContracts.id, id))
      .returning();
    return contract || undefined;
  }

  // Proposal methods
  async getProposals(projectId: string): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.projectId, projectId));
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const [proposal] = await db.insert(proposals).values(insertProposal).returning();
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const [proposal] = await db.update(proposals)
      .set(updates)
      .where(eq(proposals.id, id))
      .returning();
    return proposal || undefined;
  }

  // Message methods
  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)),
          and(eq(messages.senderId, receiverId), eq(messages.receiverId, senderId))
        )
      )
      .orderBy(messages.createdAt);
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    // Get all messages for this user
    const userMessages = await db.select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversations = new Map<string, { user: User; lastMessage: Message; unreadCount: number }>();

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversations.has(otherUserId)) {
        const [user] = await db.select().from(users).where(eq(users.id, otherUserId));
        if (user) {
          // Count unread messages from this other user
          const unreadMessages = await db.select()
            .from(messages)
            .where(
              and(
                eq(messages.senderId, otherUserId),
                eq(messages.receiverId, userId),
                eq(messages.isRead, false)
              )
            );

          conversations.set(otherUserId, {
            user,
            lastMessage: message,
            unreadCount: unreadMessages.length,
          });
        }
      }
    }

    return Array.from(conversations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }

  // Milestone methods
  async getMilestones(projectId: string): Promise<Milestone[]> {
    return await db.select().from(milestones).where(eq(milestones.projectId, projectId));
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db.insert(milestones).values(insertMilestone).returning();
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined> {
    const [milestone] = await db.update(milestones)
      .set(updates)
      .where(eq(milestones.id, id))
      .returning();
    return milestone || undefined;
  }
}

export const storage = new DatabaseStorage();
