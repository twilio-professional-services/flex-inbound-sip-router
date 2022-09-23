import React, { useEffect, useState } from 'react';
import { SidePanel } from '@twilio/flex-ui';
import { Alert } from '@twilio-paste/core/alert';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { Stack } from '@twilio-paste/core/stack';

import { getDefaultRoute, updateDefaultRoute } from '../../utils/inbound-sip-router';

interface OwnProps {
  isOpen: boolean;
  onClose: () => void;
}

const DefaultRouteEditor = (props: OwnProps) => {
  const [type, setType] = useState("webhook");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState('');
  
  useEffect(() => {
    setError('');
    
    if (!props.isOpen) {
      return;
    }
    
    const defaultRoute = getDefaultRoute();
    setType(defaultRoute.type);
    setDestination(defaultRoute.destination);
    
  }, [props.isOpen]);
  
  const handleChangeType = (value: string) => {
    setType(value);
  }
  
  const handleChangeDestination = (event: React.FormEvent<HTMLInputElement>) => {
    setDestination(event.currentTarget.value);
  }
  
  const handleSave = () => {
    if (!destination) {
      setError('Destination is a required field.');
      return;
    }
    
    setError('');
    updateDefaultRoute({ type, destination });
    props.onClose();
  }
  
  return (
    <SidePanel
      displayName='defaultRouteEditor'
      isHidden={!props.isOpen}
      handleCloseClick={props.onClose}
      title={<span>Edit Default Route</span>}
    >
      <Box padding='space60'>
        <Stack orientation="vertical" spacing='space80'>
          <RadioGroup
            name="defaultType"
            value={type}
            legend="Destination Type"
            onChange={handleChangeType}
            orientation="vertical"
            required>
            <Radio
              id="defaultDialClient"
              value="dial-client"
              name="defaultType">
              Dial client
            </Radio>
            <Radio
              id="defaultDialSip"
              value="dial-sip"
              name="defaultType">
              Dial SIP
            </Radio>
            <Radio
              id="defaultPlay"
              value="play"
              name="defaultType">
              Play
            </Radio>
            <Radio
              id="defaultRefer"
              value="refer"
              name="defaultType">
              Refer
            </Radio>
            <Radio
              id="defaultSay"
              value="say"
              name="defaultType">
              Say
            </Radio>
            <Radio
              id="defaultWebhook"
              value="webhook"
              name="defaultType">
              Webhook
            </Radio>
            <Radio
              id="defaultTwiml"
              value="twiml"
              name="defaultType">
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
          <Stack orientation='horizontal' spacing='space60'>
            <Button variant='primary' onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </SidePanel>
  );
}

export default DefaultRouteEditor;