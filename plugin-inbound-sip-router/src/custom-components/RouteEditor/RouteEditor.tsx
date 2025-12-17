import React, { useEffect, useState } from 'react';
import { SidePanel } from '@twilio/flex-ui';
import { Alert } from '@twilio-paste/core/alert';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';

import { isRouteUnique, updateRouteData } from '../../utils/inbound-sip-router';
import { InboundSipRoute } from '../../types/inbound-sip-router';

interface OwnProps {
  onPanelClosed: () => void;
  showPanel: boolean;
  selectedRoute: InboundSipRoute | null;
  onUpdateRoute: (routes: InboundSipRoute[]) => void;
}

const RouteEditor = (props: OwnProps) => {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("webhook");
  const [destination, setDestination] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState('');
  
  useEffect(() => {
    resetView();
    
    if (props.selectedRoute === null) {
      return;
    }
    
    setAddress(props.selectedRoute.address);
    setType(props.selectedRoute.type);
    setDestination(props.selectedRoute.destination);
    setComment(props.selectedRoute.comment);
  }, [props.selectedRoute]);
  
  useEffect(() => {
    if (!props.showPanel) {
      resetView();
    }
  }, [props.showPanel]);
  
  const resetView = () => {
    setAddress("");
    setType("webhook");
    setDestination("");
    setComment("");
    setError('');
  }
  
  const handleChangeAddress = (event: React.FormEvent<HTMLInputElement>) => {
    setAddress(event.currentTarget.value);
  }
  
  const handleChangeType = (value: string) => {
    setType(value);
  }
  
  const handleChangeDestination = (event: React.FormEvent<HTMLInputElement>) => {
    setDestination(event.currentTarget.value);
  }
  
  const handleChangeComment = (event: React.FormEvent<HTMLInputElement>) => {
    setComment(event.currentTarget.value);
  }
  
  const handleSave = () => {
    if (!address) {
      setError('Address is a required field.');
      return;
    }
    
    if (!destination) {
      setError('Destination is a required field.');
      return;
    }
    
    const newRoute = { address, type, destination, comment };
    
    if (isRouteUnique(newRoute, props.selectedRoute)) {
      setError('');
      const newRouteData = updateRouteData(newRoute, props.selectedRoute);
      props.onUpdateRoute(newRouteData);
    } else {
      setError('Address must be unique.');
    }
  }
  
  const handleDelete = () => {
    if (!props.selectedRoute) {
      return;
    }
    
    const newRouteData = updateRouteData(null, props.selectedRoute);
    props.onUpdateRoute(newRouteData);
  }
  
  return (
    <SidePanel
      displayName='routeEditor'
      isHidden={!props.showPanel}
      handleCloseClick={props.onPanelClosed}
      title={<span>{ props.selectedRoute === null ? 'New' : 'Edit' } Route</span>}
    >
      <Box padding='space60'>
        <Stack orientation="vertical" spacing='space80'>
          <>
            <Label htmlFor="address" required>Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={handleChangeAddress}
              required />
          </>
          <>
            <Label htmlFor="comment">Comment</Label>
            <Input
              id="comment"
              name="comment"
              type="text"
              value={comment}
              onChange={handleChangeComment} />
          </>
          <RadioGroup
            name="type"
            value={type}
            legend="Destination Type"
            onChange={handleChangeType}
            orientation="vertical"
            required>
            <Radio
              id="dialApplication"
              value="dial-application"
              name="type">
              Dial application
            </Radio>
            <Radio
              id="dialClient"
              value="dial-client"
              name="type">
              Dial client
            </Radio>
            <Radio
              id="dialSip"
              value="dial-sip"
              name="type">
              Dial SIP
            </Radio>
            <Radio
              id="play"
              value="play"
              name="type">
              Play
            </Radio>
            <Radio
              id="refer"
              value="refer"
              name="type">
              Refer
            </Radio>
            <Radio
              id="say"
              value="say"
              name="type">
              Say
            </Radio>
            <Radio
              id="webhook"
              value="webhook"
              name="type">
              Webhook
            </Radio>
            <Radio
              id="twiml"
              value="twiml"
              name="type">
              Raw TwiML
            </Radio>
          </RadioGroup>
          <>
            <Label htmlFor="destination" required>Destination</Label>
            <Input
              id="destination"
              name="destination"
              type="text"
              value={destination}
              onChange={handleChangeDestination}
              required />
          </>
          {
            error.length > 0 &&
            (
              <Alert variant='error'>{error}</Alert>
            )
          }
          <Stack orientation='horizontal' spacing='space30'>
            <Button variant='primary' onClick={handleSave}>
              Save
            </Button>
            {
              props.selectedRoute !== null &&
                (<Button variant='destructive_secondary' onClick={handleDelete}>
                  Delete
                </Button>)
            }
          </Stack>
        </Stack>
      </Box>
    </SidePanel>
  );
}

export default RouteEditor;