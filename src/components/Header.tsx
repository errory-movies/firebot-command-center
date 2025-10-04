import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Bluetooth, BluetoothConnected, Bot } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  deviceName: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Header({
  isConnected,
  deviceName,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Robot Control Center
              </h1>
              <p className="text-sm text-muted-foreground">
                {isConnected ? `Connected to ${deviceName}` : "Not connected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isConnected ? (
              <Button
                onClick={onDisconnect}
                variant="outline"
                className="gap-2"
              >
                <BluetoothConnected className="h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button onClick={onConnect} className="gap-2">
                <Bluetooth className="h-4 w-4" />
                Connect to Robot
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
