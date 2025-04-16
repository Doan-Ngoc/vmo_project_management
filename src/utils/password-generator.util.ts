export function generateRandomPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';

  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]; // random uppercase
  password += lowercase[Math.floor(Math.random() * lowercase.length)]; // random lowercase
  password += numbers[Math.floor(Math.random() * numbers.length)]; // random number
  password += special[Math.floor(Math.random() * special.length)]; // random special char

  // Fill the rest with random characters from all categories
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  // Shuffle the password to randomize the position of required characters
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
