// Utility functions for component preloading

// Cache for preloaded components
const preloadedComponents = new Map();

// Preload a component and cache it
export const preloadComponent = async (componentName, importFunction) => {
  if (preloadedComponents.has(componentName)) {
    return preloadedComponents.get(componentName);
  }

  try {
    const component = await importFunction();
    preloadedComponents.set(componentName, component);
    return component;
  } catch (error) {
    console.warn(`Failed to preload ${componentName}:`, error);
    throw error;
  }
};

// Get a preloaded component
export const getPreloadedComponent = (componentName) => {
  return preloadedComponents.get(componentName);
};

// Check if a component is preloaded
export const isComponentPreloaded = (componentName) => {
  return preloadedComponents.has(componentName);
};

// Get all preloaded component names
export const getPreloadedComponentNames = () => {
  return Array.from(preloadedComponents.keys());
};

// Clear preloaded components (useful for testing)
export const clearPreloadedComponents = () => {
  preloadedComponents.clear();
};
