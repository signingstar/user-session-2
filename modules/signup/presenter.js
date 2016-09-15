import { getUriWithRefUrl, getUriWithCheck } from "../session/form_uri";

export const presenter = (retUrl, isLogged) => {
  let uriWithRef = getUriWithRefUrl('signup', retUrl);
  let parsedUri = getUriWithCheck(isLogged, retUrl);

  return {uriWithRef, parsedUri};
};
