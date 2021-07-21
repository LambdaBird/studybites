export const propertyTypeError = (key, property, type) => ({
  key: `${key}.errors.${property}_type_err`,
  message: `Property "${property}" must be of type ${type}`,
});
export const requiredPropertyError = (key, property) => ({
  key: `${key}.errors.${property}_req_err`,
  message: `Missing required property "${property}"`,
});
export const propertyLengthError = (key, property) => ({
  key: `${key}.errors.${property}_len_err`,
  message: `Invalid length of ${property}`,
});
