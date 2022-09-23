const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);

exports.handler = async function InboundSipRouter(context, event, callback) {
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
    callback(null, response);
    return;
  }
  
  const assetPath = '/config.json';
  
  // load data
  const openData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(openData());
  
  let twiml = new Twilio.twiml.VoiceResponse();
  let to;
  
  try {
    to = event.To.match(/^(sips?):([^@]+)(?:@(.+))?$/)[2];
  } catch {
    to = event.To;
  }
  
  let route = data.routes.find(route => route.address === to);
  
  if (!route) {
    route = data.default;
  }
  
  switch (route.type) {
    case 'webhook':
      twiml.redirect(route.destination);
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
      callback(null, response);
      return;
  }
  
  callback(null, twiml);
};
