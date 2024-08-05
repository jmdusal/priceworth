/**
 * checkPasswordStrength
 * Check the strength for the password
 * 1.Contains at least one uppercase letter
 * 2.Contains at least one lowercase letter
 * 3.Contains at least one number or special character
 * 4.Does not contain newline characters and does not start with .
 * 5.At least 8 digits
 * @example
 * checkPasswordStrength("Test123!")
 */

export function checkPasswordStrength(password: string) {
  const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
  return regex.test(password);
}
