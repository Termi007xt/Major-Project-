import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertProjectModuleSchema,
  insertSmartContractSchema,
  insertProposalSchema,
  insertMessageSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/freelancers", async (req, res) => {
    try {
      const freelancers = await storage.getFreelancers();
      res.json(freelancers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch freelancers" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { clientId, freelancerId } = req.query;
      let projects;
      
      if (clientId) {
        projects = await storage.getProjectsByClient(clientId as string);
      } else if (freelancerId) {
        projects = await storage.getProjectsByFreelancer(freelancerId as string);
      } else {
        projects = await storage.getProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateProject(req.params.id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Project modules routes
  app.get("/api/projects/:id/modules", async (req, res) => {
    try {
      const modules = await storage.getProjectModules(req.params.id);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project modules" });
    }
  });

  app.post("/api/projects/:id/modules", async (req, res) => {
    try {
      const moduleData = insertProjectModuleSchema.parse({
        ...req.body,
        projectId: req.params.id,
      });
      const module = await storage.createProjectModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project module" });
    }
  });

  app.patch("/api/modules/:id", async (req, res) => {
    try {
      const updates = req.body;
      const module = await storage.updateProjectModule(req.params.id, updates);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to update module" });
    }
  });

  // Smart contract routes
  app.get("/api/projects/:id/smart-contract", async (req, res) => {
    try {
      const contract = await storage.getSmartContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: "Smart contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch smart contract" });
    }
  });

  app.post("/api/projects/:id/smart-contract", async (req, res) => {
    try {
      const contractData = insertSmartContractSchema.parse({
        ...req.body,
        projectId: req.params.id,
      });
      const contract = await storage.createSmartContract(contractData);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create smart contract" });
    }
  });

  // Proposal routes
  app.get("/api/projects/:id/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals(req.params.id);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post("/api/projects/:id/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse({
        ...req.body,
        projectId: req.params.id,
      });
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    try {
      const { senderId, receiverId, userId } = req.query;
      
      if (userId) {
        const conversations = await storage.getConversations(userId as string);
        res.json(conversations);
      } else if (senderId && receiverId) {
        const messages = await storage.getMessages(senderId as string, receiverId as string);
        res.json(messages);
      } else {
        res.status(400).json({ message: "Missing required parameters" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Milestone routes
  app.get("/api/projects/:id/milestones", async (req, res) => {
    try {
      const milestones = await storage.getMilestones(req.params.id);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
