import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Send, Clock, Hash } from 'lucide-react';
import { useESP32 } from '@/hooks/useESP32';

export const RotiMakerControl = () => {
  const { config, saveConfig, sendCommand, isLoading } = useESP32();
  const [showConfig, setShowConfig] = useState(false);
  const [time, setTime] = useState('18:30');
  const [quantity, setQuantity] = useState(5);
  const [tempConfig, setTempConfig] = useState(config);

  const handleSendCommand = async () => {
    const command = {
      time,
      quantity,
      scheduledAt: new Date().toISOString()
    };

    await sendCommand(command);
  };

  const handleSaveConfig = () => {
    saveConfig(tempConfig);
    setShowConfig(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Roti Maker</h1>
          <p className="text-muted-foreground">Schedule your fresh rotis</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Settings
            </CardTitle>
            <CardDescription>
              Set the time and quantity for your roti maker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Number of Rotis
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="text-lg"
              />
            </div>

            <Button 
              onClick={handleSendCommand}
              disabled={isLoading}
              className="w-full text-lg py-6"
              size="lg"
            >
              <Send className="h-5 w-5 mr-2" />
              {isLoading ? 'Sending...' : 'Send to ESP32'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                ESP32 Configuration
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                {showConfig ? 'Hide' : 'Configure'}
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showConfig && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip">ESP32 IP Address</Label>
                <Input
                  id="ip"
                  type="text"
                  placeholder="192.168.1.100"
                  value={tempConfig.ipAddress}
                  onChange={(e) => setTempConfig({ ...tempConfig, ipAddress: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="text"
                  placeholder="80"
                  value={tempConfig.port}
                  onChange={(e) => setTempConfig({ ...tempConfig, port: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveConfig} className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          )}
          
          {!showConfig && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connected to: {config.ipAddress}:{config.port}
              </p>
            </CardContent>
          )}
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Current schedule: {time} • {quantity} rotis
          </p>
        </div>
      </div>
    </div>
  );
};