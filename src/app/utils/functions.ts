export function generateRandomID(length = 8) {
  let lettersAndDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomID = '';
  for (let i = 0; i < length; i++) {
    randomID += lettersAndDigits.charAt(Math.floor(Math.random() * lettersAndDigits.length));
  }
  return randomID;
}
