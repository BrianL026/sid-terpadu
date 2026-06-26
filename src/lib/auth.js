import crypto from 'crypto';

/**
 * Hashes a plaintext password using Node's native scrypt algorithm with a random salt.
 * Returns a string in the format "salt:hash".
 */
export function hashPassword(password) {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored password hash or plaintext password.
 * Returns true if password matches.
 */
export function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;
  
  // If stored password does not contain a colon, it's plaintext (fallback compatibility)
  if (!storedPassword.includes(':')) {
    return password === storedPassword;
  }
  
  const [salt, hash] = storedPassword.split(':');
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === checkHash;
}
