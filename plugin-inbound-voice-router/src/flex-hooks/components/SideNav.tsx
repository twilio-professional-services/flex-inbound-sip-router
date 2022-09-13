import * as Flex from '@twilio/flex-ui';

import { canShowAdminView } from '../../utils/inbound-voice-router';
import InboundRouterSideLink from '../../custom-components/InboundRouterSideLink/InboundRouterSideLink';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (!canShowAdminView(manager)) {
    return;
  }
  
  // Add side nav button for the view
  flex.SideNav.Content.add(
    <InboundRouterSideLink viewName="inbound-voice-router" key="inbound-voice-router-side-nav" />
  );
}
