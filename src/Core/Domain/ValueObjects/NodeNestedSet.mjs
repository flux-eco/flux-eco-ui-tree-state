/**
 * The nested set for a tree node.
 * @type {NodeNestedSet}
 * @property {string} id - The id as string of the node.
 * @property {int} left
 * @property {int} right
 */
export class NodeNestedSet {
    /**
     * @param {string} id - nodeId as string
     * @param {int} left
     * @param {int} right
     * @return {NodeNestedSet}
     */
    static new(id, left, right) {
        return {
            id,
            left,
            right
        };
    }
}