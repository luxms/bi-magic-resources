/**
 *  immutable data structures: list
 *
 */
export interface IIdOwner {
    id: string | number;
}

/**
 * Find index of entity in array
 *
 * @param {T[]} es
 * @param {string | number | T} id - (string) - entity id; (number) - entity index, (T) - other entity to search with same id
 * @returns {number}
 */
export declare function getEntityIdx<T extends IIdOwner>(es: T[], id: string | number | T): number;
export declare function getEntity<T extends IIdOwner>(es: T[], id: string | number | T): T | null;

/**
 * Get Entity by id
 * @param {T[]} es entities array
 * @param {string | number} id entity id to search
 * @returns {T} entity or null
 */
export declare function $eid<T extends IIdOwner>(es: T[], id: string | number): T | null;

/**
 * Return those entites from list which ids are provided as second argument
 * @param {T[]} es
 * @param {(string | number)[]} ids
 * @returns {T[]}
 */
export declare function $esid<T extends IIdOwner>(es: T[], ids: (string | number)[]): T[];

/**
 * Get entity index in array, -1 if not exists
 * @param {T[]} es
 * @param {string | number} id
 * @returns {number}
 */
export declare function $eidx<T extends IIdOwner>(es: T[], id: string | number): number;
