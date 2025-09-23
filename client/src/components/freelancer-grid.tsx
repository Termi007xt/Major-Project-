import { Star, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

interface FreelancerGridProps {
  freelancers: User[];
}

export default function FreelancerGrid({ freelancers }: FreelancerGridProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6" data-testid="freelancer-grid">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Browse Freelancers</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{freelancers.length} freelancers available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((freelancer) => (
          <div 
            key={freelancer.id} 
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            data-testid={`card-freelancer-${freelancer.id}`}
          >
            <div className="text-center mb-4">
              <img 
                src={freelancer.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`}
                alt={`${freelancer.username} profile`}
                className="w-20 h-20 rounded-full mx-auto mb-3"
                data-testid={`img-freelancer-avatar-${freelancer.id}`}
              />
              <h3 className="text-lg font-semibold text-foreground" data-testid={`text-freelancer-name-${freelancer.id}`}>
                {freelancer.username}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-freelancer-bio-${freelancer.id}`}>
                {freelancer.bio || "Professional Freelancer"}
              </p>
              <div className="flex items-center justify-center mt-2">
                <div className="flex" data-testid={`rating-stars-${freelancer.id}`}>
                  {renderStars(freelancer.rating || "0")}
                </div>
                <span className="ml-2 text-sm text-muted-foreground" data-testid={`text-review-count-${freelancer.id}`}>
                  ({freelancer.totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium" data-testid={`text-hourly-rate-${freelancer.id}`}>
                  {freelancer.hourlyRate ? `${freelancer.hourlyRate} ETH/hour` : "Rate not specified"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="font-medium" data-testid={`text-success-rate-${freelancer.id}`}>
                  {freelancer.successRate}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects Completed:</span>
                <span className="font-medium" data-testid={`text-completed-projects-${freelancer.id}`}>
                  {freelancer.completedProjects}
                </span>
              </div>
            </div>

            {freelancer.skills && freelancer.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2" data-testid={`skills-${freelancer.id}`}>
                  {freelancer.skills.slice(0, 4).map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                      data-testid={`skill-${freelancer.id}-${index}`}
                    >
                      {skill}
                    </span>
                  ))}
                  {freelancer.skills.length > 4 && (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                      +{freelancer.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid={`button-view-profile-${freelancer.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                data-testid={`button-send-message-${freelancer.id}`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        ))}
      </div>

      {freelancers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No freelancers found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
