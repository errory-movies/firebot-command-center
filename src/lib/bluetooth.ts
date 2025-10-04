// BLE Service and Characteristic UUIDs (replace with actual ESP32 UUIDs)
export const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
export const MOVEMENT_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
export const PUMP_CHAR_UUID = "beb5483f-36e1-4688-b7f5-ea07361b26a8";
export const SENSOR_CHAR_UUID = "beb5483d-36e1-4688-b7f5-ea07361b26a8";

export interface SensorData {
  flameDetected: boolean;
  pumpStatus: boolean;
}

class BluetoothManager {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private movementChar: BluetoothRemoteGATTCharacteristic | null = null;
  private pumpChar: BluetoothRemoteGATTCharacteristic | null = null;
  private sensorChar: BluetoothRemoteGATTCharacteristic | null = null;
  private sensorCallback: ((data: SensorData) => void) | null = null;

  async connect(): Promise<void> {
    try {
      // Request device with filters
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "FireBot" }],
        optionalServices: [SERVICE_UUID],
      });

      if (!this.device.gatt) {
        throw new Error("GATT server not available");
      }

      // Connect to GATT server
      this.server = await this.device.gatt.connect();

      // Get service
      const service = await this.server.getPrimaryService(SERVICE_UUID);

      // Get characteristics
      this.movementChar = await service.getCharacteristic(MOVEMENT_CHAR_UUID);
      this.pumpChar = await service.getCharacteristic(PUMP_CHAR_UUID);
      this.sensorChar = await service.getCharacteristic(SENSOR_CHAR_UUID);

      // Start notifications for sensor data
      await this.sensorChar.startNotifications();
      this.sensorChar.addEventListener(
        "characteristicvaluechanged",
        this.handleSensorData.bind(this)
      );

      // Listen for disconnect
      this.device.addEventListener(
        "gattserverdisconnected",
        this.onDisconnected.bind(this)
      );
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      throw error;
    }
  }

  private handleSensorData(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value || !this.sensorCallback) return;

    // Parse sensor data (adjust based on your ESP32 data format)
    // Expected format: [flameDetected(0/1), pumpStatus(0/1)]
    const flameDetected = value.getUint8(0) === 1;
    const pumpStatus = value.getUint8(1) === 1;

    this.sensorCallback({
      flameDetected,
      pumpStatus,
    });
  }

  async sendCommand(command: string): Promise<void> {
    if (!this.movementChar) {
      throw new Error("Not connected to device");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await this.movementChar.writeValue(data);
  }

  async sendPumpCommand(command: string): Promise<void> {
    if (!this.pumpChar) {
      throw new Error("Not connected to device");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await this.pumpChar.writeValue(data);
  }

  onSensorData(callback: (data: SensorData) => void): void {
    this.sensorCallback = callback;
  }

  private onDisconnected(): void {
    console.log("Device disconnected");
    this.device = null;
    this.server = null;
    this.movementChar = null;
    this.pumpChar = null;
    this.sensorChar = null;
  }

  async disconnect(): Promise<void> {
    if (this.server && this.server.connected) {
      this.server.disconnect();
    }
  }

  isConnected(): boolean {
    return this.server?.connected ?? false;
  }

  getDeviceName(): string {
    return this.device?.name ?? "Unknown Device";
  }
}

export const bluetoothManager = new BluetoothManager();
