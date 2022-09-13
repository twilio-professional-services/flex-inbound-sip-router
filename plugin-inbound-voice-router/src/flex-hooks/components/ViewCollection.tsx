import * as Flex from '@twilio/flex-ui';

import { canShowAdminView } from '../../utils/inbound-voice-router';
import InboundRouterView from '../../custom-components/InboundRouterView/InboundRouterView';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (!canShowAdminView(manager)) {
    return;
  }
  
  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="inbound-voice-router" key="inbound-voice-router-view">
      <InboundRouterView key="inbound-voice-router-view-content" />
    </flex.View>
  );
}
