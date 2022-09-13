import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

interface OwnProps {
  activeView?: string;
  viewName: string;
}

const InboundRouterSideLink = (props: OwnProps) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  };
  
  return (
    <SideLink
      showLabel={true}
      icon="IncomingCall"
      iconActive="IncomingCallBold"
      isActive={ props.activeView === props.viewName}
      onClick= { navigate }
      key="inbound-voice-router-side-link"
    >
      Inbound Voice Router
    </SideLink>
  );
};

export default InboundRouterSideLink;