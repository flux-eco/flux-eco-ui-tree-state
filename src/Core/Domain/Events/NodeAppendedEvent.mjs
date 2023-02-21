/**
 * @type NodeAppendedEvent
 * @property {NodeState} nodeState
 */
export class NodeAppendedEvent {
    /**
     * @param {NodeState} nodeState
     * @return {NodeAppendedEvent}
     */
    static new(nodeState) {
        return {
            nodeState
        }
    }
}
