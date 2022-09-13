import { InboundVoiceRouterConfig } from "types/inbound-voice-router";

export interface ListConfigResponse {
  data: InboundVoiceRouterConfig;
  version: string;
  versionIsDeployed?: boolean; // only returned, not sent
}

export interface UpdateConfigResponse {
  buildSid: string;
  success: boolean;
}

export interface UpdateConfigStatusResponse {
  buildStatus: string;
  success: boolean;
}

export interface PublishConfigRequest {
  buildSid: string;
}

export interface PublishConfigResponse {
  deploymentSid: string;
  success: boolean;
}