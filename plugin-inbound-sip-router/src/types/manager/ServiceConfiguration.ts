import * as Flex from '@twilio/flex-ui';

type FlexUIAttributes = Flex.ServiceConfiguration["ui_attributes"];

export interface UIAttributes extends FlexUIAttributes {
  inbound_sip_router: {
    serverless_functions_domain: string;
  }
}
