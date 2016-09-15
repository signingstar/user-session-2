import { getUriWithRefUrl, getUriWithCheck } from "../session/form_uri";

export let presenter = function(retUrl, isLogged) {
  let uriWithRef = getUriWithRefUrl('login', retUrl);
  let parsedUri = getUriWithCheck(isLogged, retUrl);

  return {uriWithRef, parsedUri};
};
