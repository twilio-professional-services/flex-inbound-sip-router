export interface InboundSipRoute {
  address: string;
  type: string;
  destination: string;
  comment: string;
}

export interface InboundSipDefaultRoute {
  type: string;
  destination: string;
}

export interface InboundSipRouterConfig {
  routes: InboundSipRoute[];
  default: InboundSipDefaultRoute;
}