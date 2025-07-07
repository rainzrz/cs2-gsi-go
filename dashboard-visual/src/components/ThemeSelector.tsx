import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ThemeSelectorProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
}

export const ThemeSelector = ({ onThemeChange, currentTheme }: ThemeSelectorProps) => {
  const themes = [
    { name: "purple", label: "Roxo", colors: "from-purple-600 to-purple-800" },
    { name: "red", label: "Vermelho", colors: "from-red-600 to-red-800" },
    { name: "blue", label: "Azul", colors: "from-blue-600 to-blue-800" },
    { name: "green", label: "Verde", colors: "from-green-600 to-green-800" },
    { name: "yellow", label: "Amarelo", colors: "from-yellow-600 to-yellow-800" },
  ];

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Tema:</span>
          <div className="flex gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.name}
                variant={currentTheme === theme.name ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange(theme.name)}
                className="text-xs"
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.colors} mr-2`} />
                {theme.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};