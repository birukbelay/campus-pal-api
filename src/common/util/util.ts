export const pick = (object, allowedKeys) => {
  //Iterates over the allowed keys only, much more effictive
  return allowedKeys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      if (object[key] !== 'undefined') {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};
