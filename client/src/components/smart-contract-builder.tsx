import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface SmartContractBuilderProps {
  terms: SmartContractTerms;
  onTermsChange: (terms: SmartContractTerms) => void;
}

export default function SmartContractBuilder({ terms, onTermsChange }: SmartContractBuilderProps) {
  const updateTerm = (field: keyof SmartContractTerms, value: string | number) => {
    onTermsChange({
      ...terms,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6" data-testid="smart-contract-builder">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Smart Contract Terms</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-schedule">Payment Schedule</Label>
              <Select value={terms.paymentSchedule} onValueChange={(value) => updateTerm("paymentSchedule", value)}>
                <SelectTrigger data-testid="select-payment-schedule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upon_module_completion">Upon module completion</SelectItem>
                  <SelectItem value="weekly_milestones">Weekly milestones</SelectItem>
                  <SelectItem value="50_50_split">50% upfront, 50% completion</SelectItem>
                  <SelectItem value="milestone_based">Milestone-based payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="revision-rounds">Revision Rounds</Label>
              <Input
                id="revision-rounds"
                type="number"
                value={terms.revisionRounds}
                onChange={(e) => updateTerm("revisionRounds", parseInt(e.target.value) || 0)}
                placeholder="3"
                min="0"
                max="10"
                data-testid="input-revision-rounds"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cancellation-terms">Cancellation Terms</Label>
            <Textarea
              id="cancellation-terms"
              value={terms.cancellationTerms}
              onChange={(e) => updateTerm("cancellationTerms", e.target.value)}
              placeholder="Define cancellation policy and refund conditions..."
              rows={3}
              data-testid="textarea-cancellation-terms"
            />
          </div>

          <div>
            <Label htmlFor="quality-standards">Quality Standards & Acceptance Criteria</Label>
            <Textarea
              id="quality-standards"
              value={terms.qualityStandards}
              onChange={(e) => updateTerm("qualityStandards", e.target.value)}
              placeholder="Define what constitutes acceptable work completion..."
              rows={3}
              data-testid="textarea-quality-standards"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dispute-resolution">Dispute Resolution</Label>
              <Select value={terms.disputeResolution} onValueChange={(value) => updateTerm("disputeResolution", value)}>
                <SelectTrigger data-testid="select-dispute-resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community_arbitration">Community Arbitration</SelectItem>
                  <SelectItem value="platform_mediation">Platform Mediation</SelectItem>
                  <SelectItem value="external_arbitrator">External Arbitrator</SelectItem>
                  <SelectItem value="direct_negotiation">Direct Negotiation Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="gas-fee-responsibility">Gas Fee Responsibility</Label>
              <Select value={terms.gasFeeResponsibility} onValueChange={(value) => updateTerm("gasFeeResponsibility", value)}>
                <SelectTrigger data-testid="select-gas-fee-responsibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="split">Split between parties</SelectItem>
                  <SelectItem value="client_pays">Client pays all fees</SelectItem>
                  <SelectItem value="freelancer_pays">Freelancer pays all fees</SelectItem>
                  <SelectItem value="platform_covers">Platform covers fees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform-fee">Platform Fee (%)</Label>
              <Input
                id="platform-fee"
                type="number"
                step="0.1"
                value={terms.platformFee}
                onChange={(e) => updateTerm("platformFee", e.target.value)}
                placeholder="2.5"
                min="0"
                max="10"
                data-testid="input-platform-fee"
              />
            </div>
            
            <div>
              <Label htmlFor="auto-release-days">Auto-release After (Days)</Label>
              <Input
                id="auto-release-days"
                type="number"
                value={terms.autoReleaseAfterDays}
                onChange={(e) => updateTerm("autoReleaseAfterDays", parseInt(e.target.value) || 0)}
                placeholder="7"
                min="1"
                max="30"
                data-testid="input-auto-release-days"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Configuration Summary */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Escrow Configuration Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Dispute Resolution:</span>
            <span className="ml-2 font-medium" data-testid="text-dispute-resolution-summary">
              {terms.disputeResolution.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Platform Fee:</span>
            <span className="ml-2 font-medium" data-testid="text-platform-fee-summary">{terms.platformFee}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Gas Fee Responsibility:</span>
            <span className="ml-2 font-medium" data-testid="text-gas-fee-summary">
              {terms.gasFeeResponsibility.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Auto-release after:</span>
            <span className="ml-2 font-medium" data-testid="text-auto-release-summary">
              {terms.autoReleaseAfterDays} days of completion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
