const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);

exports.handler = async function inboundVoiceRouter(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Content-Type', 'application/json');
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
    case 'twiml':
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        ${route.destination}
      </Response>`
      break;
  }
  
  callback(null, twiml);
};
