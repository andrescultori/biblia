import { createContext, useContext } from 'react';

// Preferências de estudo, lidas por qualquer componente. showScholarly = false esconde a posição acadêmica.
export const SettingsContext = createContext({ showScholarly: true });
export const useSettings = () => useContext(SettingsContext);
