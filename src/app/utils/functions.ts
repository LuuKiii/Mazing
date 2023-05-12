/**
 * @param length - length of ID to be generated
 * @returns string - generated ID
 */
export function generateRandomID(length = 8): string {
  let lettersAndDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomID = '';
  for (let i = 0; i < length; i++) {
    randomID += lettersAndDigits.charAt(Math.floor(Math.random() * lettersAndDigits.length));
  }
  return randomID;
}

/**
 * Shuffles contents of passed array 
 * @param arr - array with any contents
 */
export function shuffle(arr: any[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
