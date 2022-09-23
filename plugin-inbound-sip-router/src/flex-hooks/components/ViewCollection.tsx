import * as Flex from '@twilio/flex-ui';

import { canShowAdminView } from '../../utils/inbound-sip-router';
import InboundRouterView from '../../custom-components/InboundRouterView/InboundRouterView';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (!canShowAdminView(manager)) {
    return;
  }
  
  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="inbound-sip-router" key="inbound-sip-router-view">
      <InboundRouterView key="inbound-sip-router-view-content" />
    </flex.View>
  );
}
