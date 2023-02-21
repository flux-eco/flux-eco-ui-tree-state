/**
 * @type TreeState
 * @property {Id} id - id of the tree
 * @property {object} nodeDataSchema
 * @property {NodeState} rootNode
 * @property {NodeState[]} nodes
 */
export class TreeState {
    /**
     * Creates a new Tree Node nodeState object.
     *
     * @param {Id} id - The id of the tree.
     * @param {object} nodeDataSchema
     * @param {NodeState} rootNode - tree root node state
     * @param {NodeState[]} nodes
     * @return {TreeState}
     */
    static new(id, nodeDataSchema, rootNode, nodes) {
        return {
            id,
            nodeDataSchema,
            rootNode,
            nodes
        };
    }
}