import { InboundSipRouterConfig } from "types/inbound-sip-router";

export interface ListConfigResponse {
  data: InboundSipRouterConfig;
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