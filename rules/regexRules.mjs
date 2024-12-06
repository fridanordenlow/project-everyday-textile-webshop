// REGEX
const regexRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  streetAddress: /^(?=.*[a-zA-ZåäöÅÄÖ])[a-zA-ZåäöÅÄÖ0-9\s.,-]{2,}$/,
  city: /^[a-zA-ZåäöÅÄÖ\s-]{2,}$/,
  phoneNumber: /^[0-9]{10}$/,
  zipCode: /^\d{3}\s?\d{2}$/,
  personalID: /^(19|20)?\d{2}((0[1-9])|(1[0-2]))(([0-2][0-9])|(3[0-1]))[- ]?\d{4}$/,
};

export default regexRules;
