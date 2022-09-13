import { Manager } from '@twilio/flex-ui';
import ConfigManagerService from '../../utils/serverless/ConfigManager/ConfigManagerService';
import { InboundVoiceRoute, InboundVoiceDefaultRoute } from '../../types/inbound-voice-router';
import { ListConfigResponse } from '../../types/config-manager';

let config = {
  data: {},
  version: ''
} as ListConfigResponse;

const delay = async (ms: number): Promise<void> => {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

export const canShowAdminView = (manager: Manager) => {
  const { roles } = manager.user;
  return roles.indexOf("admin") >= 0;
}

export const loadConfig = async (): Promise<ListConfigResponse | null> => {
  const listResponse = await ConfigManagerService.list();
  
  if (listResponse) {
    config = listResponse;
  } else {
    return null;
  }
  
  return config;
}

export const getDefaultRoute = (): InboundVoiceDefaultRoute => {
  return config.data.default;
}

export const updateDefaultRoute = (defaultRoute: InboundVoiceDefaultRoute) => {
  config.data.default = defaultRoute;
}

export const updateRouteData = (newRoute: InboundVoiceRoute | null, existingRoute: InboundVoiceRoute | null): InboundVoiceRoute[] => {
  if (existingRoute === null && newRoute !== null) {
    // adding route
    config.data.routes = [...config.data.routes, newRoute];
  } else if (existingRoute !== null && newRoute === null) {
    // removing existing route
    const existingIndex = config.data.routes.indexOf(existingRoute);
    
    if (existingIndex >= 0) {
      config.data.routes.splice(existingIndex, 1);
    }
  } else if (existingRoute !== null && newRoute !== null) {
    // updating existing route
    const existingIndex = config.data.routes.indexOf(existingRoute);
    
    if (existingIndex >= 0) {
      config.data.routes.splice(existingIndex, 1, newRoute);
    }
  }
  
  return config.data.routes;
}

export const isRouteUnique = (newRoute: InboundVoiceRoute, existingRoute: InboundVoiceRoute | null): boolean => {
  if (existingRoute !== null) {
    const otherRoutes = config.data.routes.filter(item => existingRoute.address !== item.address);
    const matchingRoutes = otherRoutes.filter(item => newRoute.address === item.address);
    return matchingRoutes.length == 0;
  } else {
    const matchingRoutes = config.data.routes.filter(item => newRoute.address === item.address);
    return matchingRoutes.length == 0;
  }
}

export const publishConfig = async (): Promise<number> => {
  // return values: 0=success, 2=version error, 3=failure
  const updateResponse = await ConfigManagerService.update(config);
  
  if (!updateResponse.success) {
    console.log('Config update failed', updateResponse);
    
    if (updateResponse.buildSid == 'versionError') {
      return 2;
    }
    
    return 3;
  }
  
  // the build will take several seconds. use delay and check in a loop.
  await delay(2000);
  let updateStatus = await ConfigManagerService.updateStatus(updateResponse.buildSid);
  
  while (updateStatus.buildStatus !== 'completed') {
    if (updateStatus.buildStatus === 'failed' || updateStatus.buildStatus === 'error') {
      // oh no
      console.log('Config update build failed', updateStatus);
      return 3;
    }
    
    await delay(2000);
    updateStatus = await ConfigManagerService.updateStatus(updateResponse.buildSid);
  }
  
  let publishResponse = await ConfigManagerService.publish(updateResponse.buildSid);
  
  if (!publishResponse.success) {
    console.log('Config publish failed', publishResponse);
    return 3;
  }
  
  return 0;
}