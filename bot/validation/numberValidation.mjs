export function validatePhoneNumber(num) {
  // This will allow only positive integers with length between 10 and 15
  const phoneNumberRegex = /^\d{10,15}$/;
  return phoneNumberRegex.test(num);
}
