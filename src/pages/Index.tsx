import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { ControlPanel } from "@/components/ControlPanel";
import { StatusPanel } from "@/components/StatusPanel";
import { bluetoothManager, SensorData } from "@/lib/bluetooth";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [pumpActive, setPumpActive] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    flameDetected: false,
    distance: 50,
    pumpStatus: false,
  });

  // Simulate sensor data when not connected (for testing)
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        setSensorData({
          flameDetected: Math.random() > 0.8,
          distance: Math.floor(Math.random() * 100) + 10,
          pumpStatus: pumpActive,
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isConnected, pumpActive]);

  // Setup sensor data listener when connected
  useEffect(() => {
    if (isConnected) {
      bluetoothManager.onSensorData((data) => {
        setSensorData(data);
        setPumpActive(data.pumpStatus);
      });
    }
  }, [isConnected]);

  const handleConnect = useCallback(async () => {
    try {
      await bluetoothManager.connect();
      setIsConnected(true);
      setDeviceName(bluetoothManager.getDeviceName());
      toast({
        title: "Connected",
        description: `Successfully connected to ${bluetoothManager.getDeviceName()}`,
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to device",
        variant: "destructive",
      });
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await bluetoothManager.disconnect();
      setIsConnected(false);
      setDeviceName("");
      setPumpActive(false);
      toast({
        title: "Disconnected",
        description: "Device disconnected successfully",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }, []);

  const handleMovement = useCallback(
    async (command: string) => {
      try {
        await bluetoothManager.sendCommand(command);
        const commandNames: { [key: string]: string } = {
          F: "Forward",
          B: "Backward",
          L: "Left",
          R: "Right",
          S: "Stop",
        };
        toast({
          title: "Command Sent",
          description: commandNames[command] || command,
        });
      } catch (error) {
        console.error("Command error:", error);
        toast({
          title: "Command Failed",
          description: "Failed to send command to device",
          variant: "destructive",
        });
      }
    },
    []
  );

  const handlePumpToggle = useCallback(async () => {
    const newState = !pumpActive;
    const command = newState ? "P1" : "P0";

    try {
      await bluetoothManager.sendPumpCommand(command);
      setPumpActive(newState);
      toast({
        title: `Pump ${newState ? "Activated" : "Deactivated"}`,
        description: `Water pump is now ${newState ? "ON" : "OFF"}`,
      });
    } catch (error) {
      console.error("Pump command error:", error);
      toast({
        title: "Command Failed",
        description: "Failed to toggle pump",
        variant: "destructive",
      });
    }
  }, [pumpActive]);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        isConnected={isConnected}
        deviceName={deviceName}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          <ControlPanel
            onMovement={handleMovement}
            onPumpToggle={handlePumpToggle}
            pumpActive={pumpActive}
            disabled={!isConnected}
          />

          <StatusPanel
            flameDetected={sensorData.flameDetected}
            distance={sensorData.distance}
            pumpStatus={sensorData.pumpStatus}
          />
        </div>

        {!isConnected && (
          <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-dashed max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Connect to your FireBot to enable controls. Sensor data is
              simulated when not connected.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
