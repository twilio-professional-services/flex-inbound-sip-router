exports.getRoute = (address) => {
  const assetPath = '/config.json';
  
  // load data
  const openData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(openData());
  let to;
  
  try {
    to = address.match(/^(sips?):([^@]+)(?:@(.+))?$/)[2];
  } catch {
    to = address;
  }
  
  let route = data.routes.find(route => route.address === to);
  
  if (!route) {
    route = data.default;
  }
  
  return route;
};