/**
 * Access Password Configuration
 * Single source of truth for the private access password
 */

const ENV_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD;

export const ACCESS_PASSWORD: string =
    typeof ENV_PASSWORD === 'string' && ENV_PASSWORD.length > 0
        ? ENV_PASSWORD
        : 'benias-private';
