/**
 * @type {Id}
 * @property {string} value
 * @property {string} path
 */
export class Id {
    static serviceName = "flux-eco-ui-tree-state";

    /**
     * @param {string} value
     * @returns {Id}
     */
    static newTreeId(value) {
        const path = [Id.serviceName, value].join('/');

        return {
            value,
            path
        };
    }

    /**
     * @returns {Id}
     */
    static newRootNodeId() {
        const value = "rootNode";
        let path = '/rootNode';

        return {
            value,
            path
        };
    }

    /**
     * @param {string} value
     * @param {{Id}|null} parentId the parent node id
     * @returns {Id}
     */
    static newNodeId(value, parentId) {
        let path =  '/nodes/' + value;
        if(parentId) {
            path = [parentId.path, value].join('/');
        }

        return {
            value,
            path
        };
    }
}