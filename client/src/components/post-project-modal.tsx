import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import SmartContractBuilder from "./smart-contract-builder";
import type { InsertProject, InsertProjectModule, InsertSmartContract } from "@shared/schema";

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

interface ProjectModule {
  name: string;
  description: string;
  budget: string;
  deadline: string;
  priority: "low" | "medium" | "high";
}

interface SmartContractTerms {
  paymentSchedule: string;
  revisionRounds: number;
  cancellationTerms: string;
  qualityStandards: string;
  disputeResolution: string;
  platformFee: string;
  gasFeeResponsibility: string;
  autoReleaseAfterDays: number;
}

export default function PostProjectModal({ isOpen, onClose, currentUserId }: PostProjectModalProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [modules, setModules] = useState<ProjectModule[]>([
    { name: "", description: "", budget: "", deadline: "", priority: "medium" }
  ]);
  const [contractTerms, setContractTerms] = useState<SmartContractTerms>({
    paymentSchedule: "upon_module_completion",
    revisionRounds: 3,
    cancellationTerms: "",
    qualityStandards: "",
    disputeResolution: "community_arbitration",
    platformFee: "2.5",
    gasFeeResponsibility: "split",
    autoReleaseAfterDays: 7,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project posted successfully!",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createModulesMutation = useMutation({
    mutationFn: async ({ projectId, modules }: { projectId: string; modules: ProjectModule[] }) => {
      const promises = modules.map((module, index) => {
        const moduleData: InsertProjectModule = {
          projectId,
          name: module.name,
          description: module.description,
          budget: module.budget,
          deadline: module.deadline ? new Date(module.deadline) : null,
          priority: module.priority,
          order: index + 1,
          status: "pending",
          progress: 0,
        };
        return apiRequest("POST", `/api/projects/${projectId}/modules`, moduleData);
      });
      return Promise.all(promises);
    },
  });

  const createSmartContractMutation = useMutation({
    mutationFn: async ({ projectId, terms }: { projectId: string; terms: SmartContractTerms }) => {
      const contractData: InsertSmartContract = {
        projectId,
        terms: terms as any,
        paymentSchedule: terms.paymentSchedule,
        revisionRounds: terms.revisionRounds,
        cancellationTerms: terms.cancellationTerms,
        qualityStandards: terms.qualityStandards,
        disputeResolution: terms.disputeResolution,
        platformFee: terms.platformFee,
        gasFeeResponsibility: terms.gasFeeResponsibility,
        autoReleaseAfterDays: terms.autoReleaseAfterDays,
        isActive: true,
      };
      return apiRequest("POST", `/api/projects/${projectId}/smart-contract`, contractData);
    },
  });

  const handleClose = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setCategory("");
    setTotalBudget("");
    setDeadline("");
    setModules([{ name: "", description: "", budget: "", deadline: "", priority: "medium" }]);
    setContractTerms({
      paymentSchedule: "upon_module_completion",
      revisionRounds: 3,
      cancellationTerms: "",
      qualityStandards: "",
      disputeResolution: "community_arbitration",
      platformFee: "2.5",
      gasFeeResponsibility: "split",
      autoReleaseAfterDays: 7,
    });
    onClose();
  };

  const addModule = () => {
    setModules([...modules, { name: "", description: "", budget: "", deadline: "", priority: "medium" }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: keyof ProjectModule, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const handleSubmit = async () => {
    if (!title || !description || !totalBudget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectData: InsertProject = {
        title,
        description,
        clientId: currentUserId,
        totalBudget,
        category: category || "General",
        tags: [],
        deadline: deadline ? new Date(deadline) : null,
        status: "open",
        smartContractAddress: `0x${Math.random().toString(16).substring(2, 12)}`,
        escrowStatus: "pending",
      };

      const project = await createProjectMutation.mutateAsync(projectData);
      
      // Create modules
      const validModules = modules.filter(m => m.name && m.budget);
      if (validModules.length > 0) {
        await createModulesMutation.mutateAsync({ projectId: project.id, modules: validModules });
      }
      
      // Create smart contract
      await createSmartContractMutation.mutateAsync({ projectId: project.id, terms: contractTerms });
      
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-testid="modal-post-project">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Post New Project</h2>
            <button 
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-modal"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
              <span className="ml-2">Project Details</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
              <span className="ml-2">Modules</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>
              <span className="ml-2">Smart Contract</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-title">Project Title *</Label>
                <Input
                  id="project-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  data-testid="input-project-title"
                />
              </div>

              <div>
                <Label htmlFor="project-description">Project Description *</Label>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project in detail"
                  rows={4}
                  data-testid="textarea-project-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="project-category">Category</Label>
                  <Input
                    id="project-category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Web Development"
                    data-testid="input-project-category"
                  />
                </div>
                <div>
                  <Label htmlFor="project-budget">Total Budget (ETH) *</Label>
                  <Input
                    id="project-budget"
                    type="number"
                    step="0.1"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="0.0"
                    data-testid="input-project-budget"
                  />
                </div>
                <div>
                  <Label htmlFor="project-deadline">Deadline</Label>
                  <Input
                    id="project-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    data-testid="input-project-deadline"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Break Down Into Modules</Label>
                <Button
                  onClick={addModule}
                  variant="outline"
                  size="sm"
                  data-testid="button-add-module"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>
              
              {modules.map((module, index) => (
                <div key={index} className="border border-border rounded-lg p-4" data-testid={`module-form-${index}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Module {index + 1}</h4>
                    {modules.length > 1 && (
                      <Button
                        onClick={() => removeModule(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-remove-module-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Module Name</Label>
                      <Input
                        value={module.name}
                        onChange={(e) => updateModule(index, "name", e.target.value)}
                        placeholder="e.g., UI Design"
                        data-testid={`input-module-name-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Budget (ETH)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={module.budget}
                        onChange={(e) => updateModule(index, "budget", e.target.value)}
                        placeholder="0.0"
                        data-testid={`input-module-budget-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={module.deadline}
                        onChange={(e) => updateModule(index, "deadline", e.target.value)}
                        data-testid={`input-module-deadline-${index}`}
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={module.priority} onValueChange={(value) => updateModule(index, "priority", value)}>
                        <SelectTrigger data-testid={`select-module-priority-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Label>Module Description</Label>
                    <Textarea
                      value={module.description}
                      onChange={(e) => updateModule(index, "description", e.target.value)}
                      placeholder="Describe this module..."
                      rows={2}
                      data-testid={`textarea-module-description-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <SmartContractBuilder
              terms={contractTerms}
              onTermsChange={setContractTerms}
            />
          )}
        </div>

        <div className="p-6 border-t border-border flex justify-between">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                data-testid="button-previous-step"
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              data-testid="button-save-draft"
            >
              Save Draft
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                data-testid="button-next-step"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createProjectMutation.isPending}
                data-testid="button-deploy-contract"
              >
                {createProjectMutation.isPending ? "Creating..." : "Deploy Smart Contract & Post Project"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
