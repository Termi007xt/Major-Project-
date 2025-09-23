import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ProjectCard from "@/components/project-card";
import PostProjectModal from "@/components/post-project-modal";
import FreelancerGrid from "@/components/freelancer-grid";
import MessagingInterface from "@/components/messaging-interface";
import { WalletConnection, WalletConnectionCompact } from "@/components/wallet-connection";
import type { Project, User } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("active-projects");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Mock current user - in a real app this would come from auth
  const currentUserId = "client-1";

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch(`/api/projects?clientId=${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  const { data: freelancers = [], isLoading: freelancersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/freelancers"],
    queryFn: async () => {
      const response = await fetch("/api/users/freelancers");
      if (!response.ok) throw new Error("Failed to fetch freelancers");
      return response.json();
    },
  });

  const tabs = [
    { id: "active-projects", label: "Active Projects" },
    { id: "post-project", label: "Post New Project" },
    { id: "smart-contracts", label: "Smart Contracts" },
    { id: "messages", label: "Messages" },
    { id: "browse-freelancers", label: "Browse Freelancers" },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "post-project") {
      setIsPostModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Project Dashboard</h1>
              <p className="text-muted-foreground">Manage your blockchain-powered freelancing projects</p>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnectionCompact />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "active-projects" && (
          <div className="space-y-6" data-testid="content-active-projects">
            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading projects...</div>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No active projects found</div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="button-post-first-project"
                >
                  Post Your First Project
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "smart-contracts" && (
          <div className="space-y-6" data-testid="content-smart-contracts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Wallet Connection */}
              <div className="flex justify-center">
                <WalletConnection />
              </div>
              
              {/* Smart Contract Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Blockchain Features</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">🔗 Smart Contract Escrow</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure milestone-based payments with automated escrow release. 
                      Connect your wallet to deploy project contracts.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">💰 Cryptocurrency Payments</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay and receive payments in ETH on Sepolia testnet. 
                      Real money handling for production deployments.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">📦 On-Chain Project Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      Store project modules and deliverables on-chain with IPFS integration 
                      for permanent, decentralized file storage.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">⚖️ Decentralized Disputes</h3>
                    <p className="text-sm text-muted-foreground">
                      Community-driven dispute resolution with automated arbitration 
                      and transparent voting mechanisms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div data-testid="content-messages">
            <MessagingInterface currentUserId={currentUserId} />
          </div>
        )}

        {activeTab === "browse-freelancers" && (
          <div data-testid="content-browse-freelancers">
            {freelancersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading freelancers...</div>
              </div>
            ) : (
              <FreelancerGrid freelancers={freelancers} />
            )}
          </div>
        )}
      </div>

      {/* Post Project Modal */}
      <PostProjectModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
