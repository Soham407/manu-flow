import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcryptjs
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, SALT_ROUNDS);
};

/**
 * Verify a password against a hash using bcryptjs
 * @param password The plain text password to verify
 * @param hash The hash to verify against
 * @returns True if the password matches the hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
}; 