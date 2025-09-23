import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWeb3 } from '@/contexts/web3-context';
import { Wallet, PowerOff, Network, ExternalLink } from 'lucide-react';

export function WalletConnection() {
  const {
    account,
    isConnecting,
    isConnected,
    network,
    connectWallet,
    disconnectWallet,
    switchToTestnet,
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkDisplayName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 5: return 'Goerli Testnet';
      case 137: return 'Polygon';
      default: return `Chain ${chainId}`;
    }
  };

  const isTestnet = network && [11155111, 5].includes(network.chainId);

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect your MetaMask wallet to access blockchain features
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
            data-testid="button-connect-wallet"
          >
            {isConnecting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </>
            )}
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            Don't have MetaMask? 
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-primary hover:underline"
              data-testid="link-install-metamask"
            >
              Install here <ExternalLink className="inline h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wallet Connected</CardTitle>
          <Badge variant="secondary" className="text-green-600">
            <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account:</span>
            <code 
              className="text-sm bg-muted px-2 py-1 rounded"
              data-testid="text-wallet-address"
            >
              {account && formatAddress(account)}
            </code>
          </div>
          
          {network && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isTestnet ? "default" : "destructive"}
                  data-testid="text-network-name"
                >
                  <Network className="mr-1 h-3 w-3" />
                  {getNetworkDisplayName(network.chainId)}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Network Actions */}
        {network && !isTestnet && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Switch to testnet for development features
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={switchToTestnet}
              className="w-full"
              data-testid="button-switch-testnet"
            >
              <Network className="mr-2 h-3 w-3" />
              Switch to Sepolia Testnet
            </Button>
          </div>
        )}

        {/* Disconnect */}
        <Button 
          variant="outline" 
          onClick={disconnectWallet}
          className="w-full"
          data-testid="button-disconnect-wallet"
        >
          <PowerOff className="mr-2 h-4 w-4" />
          Disconnect Wallet
        </Button>

        {/* Blockchain Features Status */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔗 Smart contract integration: Ready</p>
            <p>💰 Crypto payments: {isTestnet ? 'Available' : 'Switch to testnet'}</p>
            <p>📦 On-chain storage: {isTestnet ? 'Available' : 'Switch to testnet'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for navbar/header
export function WalletConnectionCompact() {
  const {
    account,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    network,
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={connectWallet}
        disabled={isConnecting}
        size="sm"
        data-testid="button-connect-wallet-compact"
      >
        {isConnecting ? (
          <>
            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-3 w-3" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" data-testid="text-wallet-address-compact">
        <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
        {account && formatAddress(account)}
      </Badge>
      {network && (
        <Badge 
          variant="secondary" 
          className="text-xs"
          data-testid="text-network-compact"
        >
          {network.name}
        </Badge>
      )}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={disconnectWallet}
        data-testid="button-disconnect-wallet-compact"
      >
        <PowerOff className="h-3 w-3" />
      </Button>
    </div>
  );
}