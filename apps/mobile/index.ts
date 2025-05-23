/**
 * VibeWell Mobile App
 * Main entry point
 */

// Initialize polyfills before anything else
import './src/utils/node-polyfills';

// Initialize the application
import { registerRootComponent } from 'expo';
import App from './App';

// Register the root component
registerRootComponent(App);
