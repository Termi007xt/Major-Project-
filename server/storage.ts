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
  type InsertMilestone
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private projectModules: Map<string, ProjectModule>;
  private smartContracts: Map<string, SmartContract>;
  private proposals: Map<string, Proposal>;
  private messages: Map<string, Message>;
  private milestones: Map<string, Milestone>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.projectModules = new Map();
    this.smartContracts = new Map();
    this.proposals = new Map();
    this.messages = new Map();
    this.milestones = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const client1: User = {
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
      createdAt: new Date(),
    };

    const freelancer1: User = {
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
      createdAt: new Date(),
    };

    const freelancer2: User = {
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
      createdAt: new Date(),
    };

    this.users.set(client1.id, client1);
    this.users.set(freelancer1.id, freelancer1);
    this.users.set(freelancer2.id, freelancer2);

    // Create sample projects
    const project1: Project = {
      id: "project-1",
      title: "E-commerce Mobile App Development",
      description: "Build a modern e-commerce mobile application with blockchain integration",
      clientId: client1.id,
      freelancerId: freelancer1.id,
      totalBudget: "5.5",
      status: "in_progress",
      category: "Mobile Development",
      tags: ["React Native", "E-commerce", "Blockchain"],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      smartContractAddress: "0xabc123def456",
      escrowStatus: "funded",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    const project2: Project = {
      id: "project-2",
      title: "Smart Contract Audit & Security Review",
      description: "Comprehensive security audit of DeFi smart contracts",
      clientId: client1.id,
      freelancerId: freelancer2.id,
      totalBudget: "3.2",
      status: "completed",
      category: "Security",
      tags: ["Smart Contracts", "Security", "Audit"],
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      smartContractAddress: "0xdef456abc789",
      escrowStatus: "released",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    this.projects.set(project1.id, project1);
    this.projects.set(project2.id, project2);

    // Create sample modules
    const modules: ProjectModule[] = [
      {
        id: "module-1",
        projectId: project1.id,
        name: "UI/UX Design",
        description: "Create user interface designs and user experience flows",
        budget: "1.5",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "completed",
        priority: "high",
        progress: 100,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: "module-2",
        projectId: project1.id,
        name: "Frontend Development",
        description: "Implement the user interface using React Native",
        budget: "2.5",
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: "in_progress",
        priority: "high",
        progress: 65,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: "module-3",
        projectId: project1.id,
        name: "Backend API",
        description: "Develop RESTful API and blockchain integration",
        budget: "1.5",
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: "pending",
        priority: "medium",
        progress: 0,
        order: 3,
        createdAt: new Date(),
      },
    ];

    modules.forEach(module => this.projectModules.set(module.id, module));

    // Create sample messages
    const sampleMessages: Message[] = [
      {
        id: "msg-1",
        projectId: project1.id,
        senderId: freelancer1.id,
        receiverId: client1.id,
        content: "I've completed the UI mockups for review",
        fileAttachment: null,
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: "msg-2",
        projectId: project2.id,
        senderId: freelancer2.id,
        receiverId: client1.id,
        content: "Security audit report is ready for your review",
        fileAttachment: null,
        isRead: true,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
    ];

    sampleMessages.forEach(msg => this.messages.set(msg.id, msg));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      walletAddress: insertUser.walletAddress || null,
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
      skills: insertUser.skills || null,
      hourlyRate: insertUser.hourlyRate || null,
      successRate: insertUser.successRate || null,
      completedProjects: insertUser.completedProjects || null,
      rating: insertUser.rating || null,
      totalReviews: insertUser.totalReviews || null,
      isFreelancer: insertUser.isFreelancer || null,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getFreelancers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isFreelancer);
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.clientId === clientId);
  }

  async getProjectsByFreelancer(freelancerId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.freelancerId === freelancerId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      freelancerId: insertProject.freelancerId || null,
      category: insertProject.category || null,
      tags: insertProject.tags || null,
      deadline: insertProject.deadline || null,
      smartContractAddress: insertProject.smartContractAddress || null,
      escrowStatus: insertProject.escrowStatus || null,
      status: insertProject.status || "open",
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Project module methods
  async getProjectModules(projectId: string): Promise<ProjectModule[]> {
    return Array.from(this.projectModules.values())
      .filter(m => m.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async createProjectModule(insertModule: InsertProjectModule): Promise<ProjectModule> {
    const id = randomUUID();
    const module: ProjectModule = {
      ...insertModule,
      description: insertModule.description || null,
      deadline: insertModule.deadline || null,
      progress: insertModule.progress || null,
      priority: insertModule.priority || null,
      status: insertModule.status || "pending",
      id,
      createdAt: new Date(),
    };
    this.projectModules.set(id, module);
    return module;
  }

  async updateProjectModule(id: string, updates: Partial<ProjectModule>): Promise<ProjectModule | undefined> {
    const module = this.projectModules.get(id);
    if (!module) return undefined;
    
    const updatedModule = { ...module, ...updates };
    this.projectModules.set(id, updatedModule);
    return updatedModule;
  }

  // Smart contract methods
  async getSmartContract(projectId: string): Promise<SmartContract | undefined> {
    return Array.from(this.smartContracts.values()).find(sc => sc.projectId === projectId);
  }

  async createSmartContract(insertContract: InsertSmartContract): Promise<SmartContract> {
    const id = randomUUID();
    const contract: SmartContract = {
      ...insertContract,
      revisionRounds: insertContract.revisionRounds || null,
      cancellationTerms: insertContract.cancellationTerms || null,
      qualityStandards: insertContract.qualityStandards || null,
      disputeResolution: insertContract.disputeResolution || null,
      platformFee: insertContract.platformFee || null,
      gasFeeResponsibility: insertContract.gasFeeResponsibility || null,
      autoReleaseAfterDays: insertContract.autoReleaseAfterDays || null,
      isActive: insertContract.isActive || null,
      id,
      createdAt: new Date(),
    };
    this.smartContracts.set(id, contract);
    return contract;
  }

  async updateSmartContract(id: string, updates: Partial<SmartContract>): Promise<SmartContract | undefined> {
    const contract = this.smartContracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...updates };
    this.smartContracts.set(id, updatedContract);
    return updatedContract;
  }

  // Proposal methods
  async getProposals(projectId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(p => p.projectId === projectId);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      status: insertProposal.status || null,
      proposedDeadline: insertProposal.proposedDeadline || null,
      id,
      createdAt: new Date(),
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    
    const updatedProposal = { ...proposal, ...updates };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Message methods
  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => 
        (m.senderId === senderId && m.receiverId === receiverId) ||
        (m.senderId === receiverId && m.receiverId === senderId)
      )
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

    const conversations = new Map<string, { user: User; lastMessage: Message; unreadCount: number }>();

    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversations.has(otherUserId)) {
        const user = this.users.get(otherUserId);
        if (user) {
          const unreadCount = Array.from(this.messages.values())
            .filter(m => m.senderId === otherUserId && m.receiverId === userId && !m.isRead)
            .length;

          conversations.set(otherUserId, {
            user,
            lastMessage: message,
            unreadCount,
          });
        }
      }
    }

    return Array.from(conversations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      projectId: insertMessage.projectId || null,
      fileAttachment: insertMessage.fileAttachment || null,
      isRead: insertMessage.isRead || null,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.isRead = true;
      this.messages.set(id, message);
    }
  }

  // Milestone methods
  async getMilestones(projectId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).filter(m => m.projectId === projectId);
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const milestone: Milestone = {
      ...insertMilestone,
      status: insertMilestone.status || null,
      moduleId: insertMilestone.moduleId || null,
      completedAt: insertMilestone.completedAt || null,
      paidAt: insertMilestone.paidAt || null,
      id,
      createdAt: new Date(),
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone | undefined> {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;
    
    const updatedMilestone = { ...milestone, ...updates };
    this.milestones.set(id, updatedMilestone);
    return updatedMilestone;
  }
}

export const storage = new MemStorage();
