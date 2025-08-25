import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface RotiCommand {
  time: string;
  quantity: number;
  scheduledAt: string;
}

interface ESP32Config {
  ipAddress: string;
  port: string;
}

export const useESP32 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ESP32Config>(() => {
    const stored = localStorage.getItem('esp32-config');
    return stored ? JSON.parse(stored) : { ipAddress: '192.168.1.100', port: '80' };
  });

  const saveConfig = (newConfig: ESP32Config) => {
    setConfig(newConfig);
    localStorage.setItem('esp32-config', JSON.stringify(newConfig));
  };

  const sendCommand = async (command: RotiCommand) => {
    if (!config.ipAddress) {
      toast({
        title: "Configuration Required",
        description: "Please set your ESP32 IP address first",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      const url = `http://${config.ipAddress}:${config.port}/roti-command`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Command Sent Successfully",
        description: `Roti scheduled for ${command.time} (${command.quantity} pieces)`,
      });

      return true;
    } catch (error) {
      console.error('ESP32 communication error:', error);
      
      toast({
        title: "Connection Failed",
        description: `Unable to connect to ESP32 at ${config.ipAddress}:${config.port}`,
        variant: "destructive"
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    saveConfig,
    sendCommand,
    isLoading
  };
};