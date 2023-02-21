/**
 * @type NodeStateStatus
 * @property {boolean} expanded
 * @property {boolean} deleted
 */
export class NodeStateStatus {
    /**
     * @param {boolean} expanded
     * @param {boolean} deleted
     * @returns {NodeStateStatus}
     */
    static new(
        expanded = false,
        deleted = false
    ) {

        return {
            expanded,
            deleted
        };
    }
}