import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Gauge, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusPanelProps {
  flameDetected: boolean;
  distance: number;
  pumpStatus: boolean;
}

export function StatusPanel({
  flameDetected,
  distance,
  pumpStatus,
}: StatusPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flame Detection */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                flameDetected ? "bg-destructive/10" : "bg-success/10"
              )}
            >
              <Flame
                className={cn(
                  "h-5 w-5",
                  flameDetected ? "text-destructive" : "text-success"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Fire Detection</p>
              <p className="text-xs text-muted-foreground">
                Environmental sensor
              </p>
            </div>
          </div>
          <Badge
            variant={flameDetected ? "destructive" : "default"}
            className={cn(
              !flameDetected && "bg-success hover:bg-success/90",
              flameDetected && "animate-pulse-glow"
            )}
          >
            {flameDetected ? "Fire Detected" : "Safe"}
          </Badge>
        </div>

        {/* Distance Sensor */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                distance < 20 ? "bg-warning/10" : "bg-primary/10"
              )}
            >
              <Gauge
                className={cn(
                  "h-5 w-5",
                  distance < 20 ? "text-warning" : "text-primary"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Distance</p>
              <p className="text-xs text-muted-foreground">Obstacle sensor</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{distance}</p>
            <p className="text-xs text-muted-foreground">cm</p>
          </div>
        </div>

        {/* Pump Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                pumpStatus ? "bg-primary/10" : "bg-muted"
              )}
            >
              <Droplet
                className={cn(
                  "h-5 w-5",
                  pumpStatus ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Water Pump</p>
              <p className="text-xs text-muted-foreground">Extinguisher system</p>
            </div>
          </div>
          <Badge
            variant={pumpStatus ? "default" : "secondary"}
            className={cn(pumpStatus && "animate-pulse-glow")}
          >
            {pumpStatus ? "Active" : "Standby"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
