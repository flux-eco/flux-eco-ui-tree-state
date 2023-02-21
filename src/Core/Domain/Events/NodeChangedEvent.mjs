/**
 * @type NodeChangedEvent
 * @property {NodeState} nodeState
 */
export class NodeChangedEvent {
    /**
     * @param {NodeState} nodeState
     * @return {NodeChangedEvent}
     */
    static new(nodeState) {
        return {
            nodeState
        }
    }
}
