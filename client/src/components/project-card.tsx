import { useQuery } from "@tanstack/react-query";
import { Clock, DollarSign, User, Eye, MessageCircle, FileText, Check, ExternalLink } from "lucide-react";
import type { Project, ProjectModule, User as UserType } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { data: modules = [] } = useQuery<ProjectModule[]>({
    queryKey: ["/api/projects", project.id, "modules"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/modules`);
      if (!response.ok) throw new Error("Failed to fetch modules");
      return response.json();
    },
  });

  const { data: freelancer } = useQuery<UserType>({
    queryKey: ["/api/users", project.freelancerId],
    queryFn: async () => {
      if (!project.freelancerId) return null;
      const response = await fetch(`/api/users/${project.freelancerId}`);
      if (!response.ok) throw new Error("Failed to fetch freelancer");
      return response.json();
    },
    enabled: !!project.freelancerId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow" data-testid={`card-project-${project.id}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-project-title-${project.id}`}>
            {project.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center" data-testid={`text-posted-date-${project.id}`}>
              <Clock className="h-4 w-4 mr-1" />
              Posted {formatTimeAgo(project.createdAt || new Date())}
            </span>
            <span className="flex items-center" data-testid={`text-budget-${project.id}`}>
              <DollarSign className="h-4 w-4 mr-1" />
              {project.totalBudget} ETH Budget
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {modules.length} Modules
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span 
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
            data-testid={`status-${project.id}`}
          >
            {project.status === "in_progress" ? "In Progress" : 
             project.status === "completed" ? "Completed" : 
             project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <button className="text-muted-foreground hover:text-foreground" data-testid={`button-menu-${project.id}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modular Task Breakdown */}
      {modules.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Project Modules</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="border border-border rounded-lg p-4 bg-muted/50"
                data-testid={`module-${module.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" data-testid={`text-module-name-${module.id}`}>
                    {module.name}
                  </span>
                  <span 
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(module.status)}`}
                    data-testid={`status-module-${module.id}`}
                  >
                    {module.status === "in_progress" ? "In Progress" : 
                     module.status === "completed" ? "Completed" : 
                     module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(module.status)}`} 
                    style={{ width: `${module.progress}%` }}
                    data-testid={`progress-${module.id}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span data-testid={`text-module-budget-${module.id}`}>{module.budget} ETH</span>
                  {module.deadline && (
                    <>
                      <span> • </span>
                      <span data-testid={`text-module-deadline-${module.id}`}>
                        Due: {new Date(module.deadline).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Contract Status */}
      {project.smartContractAddress && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-primary-foreground" size={16} />
              </div>
              <div>
                <h5 className="text-sm font-medium text-foreground">Smart Contract Active</h5>
                <p className="text-xs text-muted-foreground">
                  Contract: {project.smartContractAddress} | Gas Used: 0.02 ETH
                </p>
              </div>
            </div>
            <button 
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
              data-testid={`button-view-contract-${project.id}`}
            >
              View Contract <ExternalLink className="ml-1" size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Escrow Payment Status */}
      {project.escrowStatus === "released" && project.status === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Check className="text-white" size={16} />
            </div>
            <div>
              <h5 className="text-sm font-medium text-green-800">Escrow Payment Released</h5>
              <p className="text-xs text-green-600">{project.totalBudget} ETH transferred to freelancer wallet</p>
            </div>
          </div>
        </div>
      )}

      {/* Freelancer Info & Actions */}
      {freelancer && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={freelancer.profileImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`} 
              alt="Freelancer profile" 
              className="w-10 h-10 rounded-full"
              data-testid={`img-freelancer-${freelancer.id}`}
            />
            <div>
              <p className="text-sm font-medium text-foreground" data-testid={`text-freelancer-name-${freelancer.id}`}>
                {freelancer.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {freelancer.skills?.[0] || "Freelancer"} • {freelancer.rating}★
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors text-sm flex items-center"
              data-testid={`button-message-${project.id}`}
            >
              <MessageCircle className="mr-2" size={14} />
              Message
            </button>
            <button 
              className="border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center"
              data-testid={`button-view-details-${project.id}`}
            >
              <Eye className="mr-2" size={14} />
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Leave Review Button for Completed Projects */}
      {project.status === "completed" && project.escrowStatus === "released" && (
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"
            data-testid={`button-review-${project.id}`}
          >
            <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Leave Review
          </button>
        </div>
      )}
    </div>
  );
}
