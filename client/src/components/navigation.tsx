import { Box, Wallet, Circle } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 blockchain-gradient rounded-lg flex items-center justify-center">
                <Box className="text-primary-foreground text-sm" size={16} />
              </div>
              <span className="text-xl font-bold text-foreground">BlockLance</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-projects">
              Projects
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-freelancers">
              Freelancers
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-dashboard">
              Dashboard
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-smart-contracts">
              Smart Contracts
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm" data-testid="status-connected">
              <Circle className="w-2 h-2 bg-green-500 rounded-full fill-current text-green-500" />
              <span className="text-muted-foreground">Connected</span>
            </div>
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
              data-testid="button-wallet"
            >
              <Wallet className="mr-2" size={16} />
              0x1234...5678
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
