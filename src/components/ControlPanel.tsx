import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  onMovement: (command: string) => void;
  onPumpToggle: () => void;
  pumpActive: boolean;
  disabled: boolean;
}

export function ControlPanel({
  onMovement,
  onPumpToggle,
  pumpActive,
  disabled,
}: ControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Direction Controls */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div className="col-start-2">
            <Button
              onClick={() => onMovement("F")}
              disabled={disabled}
              className="w-full h-16 text-lg font-semibold"
              variant="secondary"
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </div>

          <Button
            onClick={() => onMovement("L")}
            disabled={disabled}
            className="w-full h-16 text-lg font-semibold col-start-1 row-start-2"
            variant="secondary"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={() => onMovement("S")}
            disabled={disabled}
            className="w-full h-16 text-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground col-start-2 row-start-2"
          >
            <Square className="h-6 w-6" />
          </Button>

          <Button
            onClick={() => onMovement("R")}
            disabled={disabled}
            className="w-full h-16 text-lg font-semibold col-start-3 row-start-2"
            variant="secondary"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>

          <Button
            onClick={() => onMovement("B")}
            disabled={disabled}
            className="w-full h-16 text-lg font-semibold col-start-2 row-start-3"
            variant="secondary"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>

        {/* Pump Control */}
        <div className="pt-4 border-t">
          <Button
            onClick={onPumpToggle}
            disabled={disabled}
            className={cn(
              "w-full h-16 text-lg font-semibold gap-2 transition-all",
              pumpActive
                ? "bg-primary hover:bg-primary/90"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <Power
              className={cn(
                "h-6 w-6 transition-transform",
                pumpActive && "animate-pulse-glow"
              )}
            />
            {pumpActive ? "Pump ON" : "Pump OFF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
