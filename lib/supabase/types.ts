/**
 * Shared directory-entry shape used by employee directory mapping.
 */
export type DirectoryEntry = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    position: string;
    department: string | null;
    email: string | null;
};