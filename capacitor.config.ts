import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.raksa.promptengine',
  appName: 'Prompt Engine',
  webDir: 'out',
  ios: {
    backgroundColor: '#07070c',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  server: {
    iosScheme: 'capacitor',
  },
};

export default config;
