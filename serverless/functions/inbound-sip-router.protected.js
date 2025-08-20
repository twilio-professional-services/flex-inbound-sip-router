const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);
const { getRoute } = require(Runtime.getFunctions()['common/helpers/get-route'].path);

exports.handler = function InboundSipRouter(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Content-Type', 'text/xml');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const requiredParameters = [
    { key: 'To', purpose: 'address to route' }
  ];
  const parameterError = ParameterValidator.validate(context.PATH, event, requiredParameters);
  
  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ parameterError });
    return callback(null, response);
  }
  
  const route = getRoute(event.To);
  const twiml = new Twilio.twiml.VoiceResponse();
  
  switch (route.type) {
    case 'webhook':
      twiml.redirect(route.destination);
      break;
    case 'dial-application':
      const dialApp = twiml.dial();
      const app = dialApp.application();
      app.applicationSid(route.destination);
      break;
    case 'dial-client':
      const dialClient = twiml.dial();
      dialClient.client(route.destination);
      break;
    case 'dial-sip':
      const dialSip = twiml.dial();
      dialSip.sip(route.destination);
      break;
    case 'play':
      twiml.play(route.destination);
      break;
    case 'refer':
      const refer = twiml.refer();
      refer.sip(route.destination);
      break;
    case 'say':
      twiml.say(route.destination);
      break;
    case 'twiml':
      response.setBody(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        ${route.destination}
      </Response>`);
      return callback(null, response);
  }
  
  return callback(null, twiml);
};
