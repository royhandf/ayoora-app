import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(colorScheme || "light");

  useEffect(() => {
    setTheme(colorScheme || "light");
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a CustomThemeProvider");
  }
  return context;
};
