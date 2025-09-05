import React, { useEffect, useState } from 'react';
import { preloadComponent } from '@/utils/preloadUtils';

// Dynamic imports for all page components
const preloadComponents = {
  Customer: () => import('@/pages/Customer'),
  Invoice: () => import('@/pages/Invoice'),
  POS: () => import('@/pages/POS'),
  Product: () => import('@/pages/Product'),
  Inventory: () => import('@/pages/Inventory'),
  Supplier: () => import('@/pages/Supplier'),
  Reports: () => import('@/pages/Reports'),
  PurchaseOrders: () => import('@/pages/PurchaseOrders'),
  AccessControl: () => import('@/pages/AccessControl'),
  Locations: () => import('@/pages/Locations'),
  InvoiceCreate: () => import('@/pages/Invoice/InvoiceCreate'),
  InvoiceRead: () => import('@/pages/Invoice/InvoiceRead'),
  InvoiceUpdate: () => import('@/pages/Invoice/InvoiceUpdate'),
  InvoiceRecordPayment: () => import('@/pages/Invoice/InvoiceRecordPayment'),
  Settings: () => import('@/pages/Settings/Settings'),
  Profile: () => import('@/pages/Profile'),
};

const PagePreloader = ({ onPreloadComplete, onPreloadStart }) => {
  const [preloadedComponents, setPreloadedComponents] = useState(new Set());
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const preloadAllComponents = async () => {
      setIsPreloading(true);
      onPreloadStart?.();
      console.log('🚀 Starting background preloading of all pages...');
      
      const componentNames = Object.keys(preloadComponents);
      const preloadPromises = componentNames.map(async (componentName) => {
        try {
          // Preload the component using the utility function
          await preloadComponent(componentName, preloadComponents[componentName]);
          setPreloadedComponents(prev => new Set([...prev, componentName]));
          console.log(`✅ Preloaded: ${componentName}`);
          return { name: componentName, success: true };
        } catch (error) {
          console.warn(`⚠️ Failed to preload ${componentName}:`, error);
          return { name: componentName, success: false, error };
        }
      });

      // Wait for all components to be preloaded
      const results = await Promise.allSettled(preloadPromises);
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;
      
      console.log(`🎉 Background preloading completed! ${successful}/${componentNames.length} components loaded`);
      
      setIsPreloading(false);
      onPreloadComplete?.(successful, componentNames.length);
    };

    // Start preloading after a short delay to let the dashboard load first
    const timer = setTimeout(preloadAllComponents, 1500);
    
    return () => clearTimeout(timer);
  }, [onPreloadComplete]);

  // This component doesn't render anything visible
  return null;
};

export default PagePreloader;
