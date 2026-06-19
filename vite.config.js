
// Fonction utilitaire de Vite pour définir la configuration avec autocomplétion/typage
import { defineConfig } from 'vite'

// Configuration du serveur de développement Vite
export default defineConfig({
  server: {
    host: true,          // écoute sur toutes les interfaces réseau (accessible depuis le réseau local, pas seulement localhost)
    allowedHosts: true    // autorise n'importe quel nom d'hôte à accéder au serveur (utile derrière un tunnel/proxy)
  }
})
