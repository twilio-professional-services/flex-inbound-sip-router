export interface InboundVoiceRoute {
  address: string;
  type: string;
  destination: string;
  comment: string;
}

export interface InboundVoiceDefaultRoute {
  type: string;
  destination: string;
}

export interface InboundVoiceRouterConfig {
  routes: InboundVoiceRoute[];
  default: InboundVoiceDefaultRoute;
}