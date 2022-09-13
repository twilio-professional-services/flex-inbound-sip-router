import React, { useEffect, useState } from 'react';
import { Button } from '@twilio-paste/core/button';
import { Heading } from '@twilio-paste/core/heading';
import { Modal, ModalBody } from '@twilio-paste/core/modal';
import { Spinner } from '@twilio-paste/core/spinner';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';

import { PublishModalContent, InboundRouterViewWrapper, InboundRouterViewHeader, InboundRouterViewContent } from './InboundRouterViewStyles';

import RouteDataTable from '../RouteDataTable/RouteDataTable';
import { InboundVoiceRoute } from '../../types/inbound-voice-router';
import { loadConfig, publishConfig } from '../../utils/inbound-voice-router';

const InboundRouterView = ({}) => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ routes, setRoutes ] = useState([] as InboundVoiceRoute[]);
  const [ isVersionMismatch, setIsVersionMismatch ] = useState(false);
  const [ loadFailed, setLoadFailed ] = useState(false);
  const [ publishState, setPublishState ] = useState(0); // 0: normal; 1: publish in progress; 2: publish version error; 3: publish failed
  
  useEffect(() => {
    listRoutes();
  }, []);
  
  const listRoutes = async () => {
    setIsLoading(true);
    
    const config = await loadConfig();
    
    if (config === null) {
      setLoadFailed(true);
    } else {
      setLoadFailed(false);
      setRoutes(config.data.routes);
      setIsVersionMismatch(config.versionIsDeployed === false);
    }
    
    setIsLoading(false);
  }
  
  const updateRoutes = (newRoutes: InboundVoiceRoute[]) => {
    setRoutes(newRoutes);
  }
  
  const publish = async () => {
    setPublishState(1);
    const publishResult = await publishConfig();
    setPublishState(publishResult);
    
    if (publishResult == 0) {
      await listRoutes();
    }
  }
  
  return (
    <InboundRouterViewWrapper>
      <InboundRouterViewHeader>
        <Heading as="h3" variant="heading30" marginBottom='space0'>
          Inbound Voice Router
        </Heading>
        <Stack orientation='horizontal' spacing='space30'>
          { publishState < 2 && isVersionMismatch && (
            <Text as='span'>Another route publish is in progress. Publishing now will overwrite other changes.</Text>
          )}
          { publishState == 2 && (
            <Text as='span'>Routes were updated by someone else and cannot be published. Please reload and try again.</Text>
          )}
          { publishState == 3 && (
            <Text as='span'>Route publish failed.</Text>
          )}
          <Button variant='secondary' onClick={publish}>Publish Routes</Button>
        </Stack>
      </InboundRouterViewHeader>
      <InboundRouterViewContent>
        <RouteDataTable
          isLoading={isLoading}
          routes={routes}
          updateRoutes={updateRoutes} />
      </InboundRouterViewContent>
      <Modal
        isOpen={publishState === 1}
        onDismiss={()=>{}}
        size='default'
        ariaLabelledby=''>
        <ModalBody>
          <PublishModalContent>
            <Stack orientation='horizontal' spacing='space60'>
              <Spinner decorative={true} size='sizeIcon100' title='Please wait...' />
              <Stack orientation='vertical' spacing='space20'>
                <Heading as='h3' variant='heading30' marginBottom='space0'>Publishing routes</Heading>
                <Text as='p'>This may take a few moments, please wait...</Text>
              </Stack>
            </Stack>
          </PublishModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={loadFailed}
        onDismiss={()=>{}}
        size='default'
        ariaLabelledby=''>
        <ModalBody>
          <PublishModalContent>
            <Stack orientation='vertical' spacing='space20'>
              <Heading as='h3' variant='heading30' marginBottom='space0'>Failed to load routes</Heading>
              <Text as='p'>Please reload and try again.</Text>
            </Stack>
          </PublishModalContent>
        </ModalBody>
      </Modal>
    </InboundRouterViewWrapper>
  );
}

export default InboundRouterView;