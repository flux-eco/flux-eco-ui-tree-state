import {NodeStateStatus} from "./NodeStateStatus.mjs";

/**
 * @type NodeState
 * @property {Id} treeId - The tree ID object of the node
 * @property {null|Id} parentId - The parent ID object of the node - null in case of rootNodeEntity
 * @property {Id} id - The id as ID object of the node.
 * @property {NodeStateStatus} status - The status of the node, e.g. whether it is expanded or deleted.
 * @property {null|Object} data - The data of the node, conforming to the schema declared at tree level - null in case of rootNodeEntity
 * @property {NodeState[]} children - array of child nodeEntityMap
 */
export class NodeState {
    /**
     * Creates the nodeState object for the root node
     *
     * @param {Id} treeId
     * @param {Id} id
     * @returns {NodeState}
     */
    static newRootNode(
        treeId,
        id
    ) {

        return {
            treeId,
            parentId: null,
            id,
            status: NodeStateStatus.new(true),
            data: null,
            children: [],
        };
    }

    /**
     * Creates the nodeState object for child nodeEntityMap
     *
     * @param {Id} treeId
     * @param {{Id}|null} parentId
     * @param {Id} id
     * @param {NodeStateStatus} status
     * @param {Object} data
     * @returns {NodeState}
     */
    static new(treeId,
               parentId,
               id,
               status,
               data = {}
    ) {
        return {
            treeId,
            parentId,
            id,
            status,
            data,
            children: []
        };
    }
}