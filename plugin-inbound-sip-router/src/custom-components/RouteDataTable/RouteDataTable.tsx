import React, { useEffect, useState } from 'react';
import { ColumnDefinition, DataTable } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { PlusIcon } from "@twilio-paste/icons/esm/PlusIcon";
import { Stack } from '@twilio-paste/core/stack';

import DefaultRouteEditor from '../DefaultRouteEditor/DefaultRouteEditor';
import RouteEditor from '../RouteEditor/RouteEditor';
import { InboundSipRoute } from '../../types/inbound-sip-router';

interface OwnProps {
  isLoading: boolean;
  routes: InboundSipRoute[];
  updateRoutes: (routes: InboundSipRoute[]) => void;
}

const RouteDataTable = (props: OwnProps) => {
  const [ showPanel, setShowPanel ] = useState(false);
  const [ selectedRoute, setSelectedRoute ] = useState(null as InboundSipRoute | null);
  const [ isDefaultRouteModalOpen, setIsDefaultRouteModalOpen ] = useState(false);
  
  useEffect(() => {
    if (showPanel && isDefaultRouteModalOpen) {
      onPanelClosed();
    }
  }, [isDefaultRouteModalOpen]);
  
  useEffect(() => {
    if (showPanel && isDefaultRouteModalOpen) {
      handleDefaultRouteModalClosed();
    }
  }, [showPanel]);
  
  useEffect(() => {
    if (selectedRoute !== null) {
      setShowPanel(true);
    }
  }, [selectedRoute]);
  
  const createRouteClick = () => {
    setSelectedRoute(null);
    setShowPanel(true);
  }
  
  const onPanelClosed = () => {
    setShowPanel(false);
    setSelectedRoute(null);
  }
  
  const onRowClick = (item: InboundSipRoute) => {
    setSelectedRoute(item);
  }
  
  const onUpdateRoute = (newRoutes: InboundSipRoute[]) => {
    props.updateRoutes(newRoutes);
    
    setShowPanel(false);
    setSelectedRoute(null);
  }
  
  const openDefaultRouteModal = () => {
    setIsDefaultRouteModalOpen(true);
  }
  
  const handleDefaultRouteModalClosed = () => {
    setIsDefaultRouteModalOpen(false);
  }
  
  const middleTruncate = (fullStr: string, strLen: number, separator: string) => {
    if (fullStr.length <= strLen) return fullStr;
    
    separator = separator || '...';
    
    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);
    
    return fullStr.slice(0, frontChars) + 
           separator + 
           fullStr.slice(fullStr.length - backChars);
  };
  
  return (
    <>
      <div>
        <Box padding='space60'>
          <Stack spacing='space60' orientation='horizontal'>
            <Button
              variant="primary"
              disabled={props.isLoading}
              onClick={createRouteClick}>
              <PlusIcon decorative />
              Add Route
            </Button>
            <Button
              variant="secondary"
              disabled={props.isLoading}
              onClick={openDefaultRouteModal}>
              Edit Default Route
            </Button>
          </Stack>
        </Box>
        <DataTable
          items={props.routes}
          isLoading={props.isLoading}
          onRowClick={onRowClick}
          defaultSortColumn="address-column">
          <ColumnDefinition
            key="address-column"
            header="Address"
            sortDirection='asc'
            sortingFn={(a: InboundSipRoute, b: InboundSipRoute) => (a.address > b.address) ? 1 : -1}
            content={(item: InboundSipRoute) => {
              return <span>{item.address}</span>
            }} />
          <ColumnDefinition
            key="comment-column"
            header="Comment"
            content={(item: InboundSipRoute) => {
              return <span>{item.comment}</span>
            }} />
          <ColumnDefinition
            key="type-column"
            header="Type"
            content={(item: InboundSipRoute) => {
              let displayType = item.type;
              
              switch (item.type) {
                case 'dial-client':
                  displayType = 'Dial client';
                  break;
                case 'dial-sip':
                  displayType = 'Dial SIP';
                  break;
                case 'play':
                  displayType = 'Play';
                  break;
                case 'refer':
                  displayType = 'Refer';
                  break;
                case 'say':
                  displayType = 'Say';
                  break;
                case 'webhook':
                  displayType = 'Webhook';
                  break;
                case 'twiml':
                  displayType = 'Raw TwiML';
                  break;
              }
              
              return <span>{displayType}</span>
            }} />
          <ColumnDefinition
            key="destination-column"
            header="Destination"
            content={(item: InboundSipRoute) => {
              return <span title={item.destination}>{middleTruncate(item.destination, 50, '...\u200B')}</span>
            }} />
        </DataTable>
      </div>
      <RouteEditor
        onPanelClosed={onPanelClosed}
        showPanel={showPanel}
        selectedRoute={selectedRoute}
        onUpdateRoute={onUpdateRoute} />
      <DefaultRouteEditor
        isOpen={isDefaultRouteModalOpen}
        onClose={handleDefaultRouteModalClosed} />
    </>
  );
}

export default RouteDataTable;