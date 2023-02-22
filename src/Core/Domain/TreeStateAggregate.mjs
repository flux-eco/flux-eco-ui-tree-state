import {TreeCreatedEvent} from "./Events/TreeCreatedEvent.mjs";
import {NodeNestedSet} from "./ValueObjects/NodeNestedSet.mjs";
import {NodeState} from "./ValueObjects/NodeState.mjs";
import {Id} from "./ValueObjects/Id.mjs";
import {TreeNodeEntity} from "./Entities/TreeNodeEntity.mjs";
import {TreeState} from "./ValueObjects/TreeState.mjs";
import {NodeAppendedEvent} from "./Events/NodeAppendedEvent.mjs";
import {NodeStateStatus} from "./ValueObjects/NodeStateStatus.mjs";
import {NodeChangedEvent} from "./Events/NodeChangedEvent.mjs";

export class TreeStateAggregate {
    /**
     * {EventRecorder}
     */
    #eventRecorder;

    /**
     *
     * @param eventRecorder
     * @param {Id} id
     * @param {object} nodeDataSchema
     * @param {NodeState} rootNode
     */
    constructor(eventRecorder, id, nodeDataSchema, rootNode) {
        this.#eventRecorder = eventRecorder;

        this.id = id;
        this.nodeDataSchema = nodeDataSchema;

        const rootNestedSet = NodeNestedSet.new(rootNode.id.value, 1, 2);
        this.rootNodeEntity = TreeNodeEntity.new(rootNestedSet, rootNode);

        this.nodeEntityMap = new Map();
        this.deletedNodes = new Set();
        this.nextNodeId = 1;


        //this.nodeEntityMap.set(rootNodeEntity.id.value, FluxUiTreeNodeEntity.new(rootNestedSet, rootNodeEntity));
    }

    /**
     * @param {TreeStateEventsRecorder} eventRecorder
     * @param {string} id
     * @param {object} nodeDataSchema
     * @return {TreeStateAggregate}
     */
    static create(eventRecorder, id, nodeDataSchema) {
        const treeId = Id.newTreeId(id);
        const nodeId = Id.newRootNodeId();

        const obj = new TreeStateAggregate(eventRecorder, treeId, nodeDataSchema, NodeState.newRootNode(treeId, nodeId))
        obj.#eventRecorder.recordEvent(TreeCreatedEvent.new(obj.getState()))

        return obj;
    }

    /**
     * @param {TreeStateEventsRecorder} eventRecorder
     * @param {TreeState} treeState
     * @param treeState
     * @return {TreeStateAggregate}
     */
    static async fromState(eventRecorder, treeState) {
        const id = treeState.id;
        const rootNode = treeState.rootNode;
        const nodeDataSchema = treeState.nodeDataSchema;

        const nodeStates = treeState.nodes;

        const aggregate = new TreeStateAggregate(eventRecorder, id, nodeDataSchema, rootNode)

        for (const [nodeId, nodeState] of Object.entries(nodeStates)) {
            if (!nodeState) {
                continue;
            }
            await aggregate.#applyNodeAppended(nodeState)
        }

        return aggregate;
    }

    async #applyNodeAppendedFromState(nodeState) {
        await this.#applyNodeAppended(nodeState)
        if (nodeState.children.length > 0) {
            for (const childState of nodeState.children) {
                await this.#applyNodeAppended(childState)
            }
        }
    }

    /**
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {TreeStateAggregate}
     */
    async appendNodeToRoot(nodeId, nodeData, expanded) {
        const rootNodeId = Id.newRootNodeId();
        const nodeState = NodeState.new(this.id, null, Id.newNodeId(nodeId, null), NodeStateStatus.new(expanded), nodeData)
        await this.#applyNodeAppended(nodeState)
        this.rootNodeEntity.nodeState.children.push(nodeState);

        this.#eventRecorder.recordEvent(NodeAppendedEvent.new(nodeState))
    }

    /**
     * @param {string} parentNodeId
     * @param {string} nodeId
     * @param {object} nodeData
     * @param {boolean} expanded
     * @return {TreeStateAggregate}
     */
    async appendNodeToParentNode(parentNodeId, nodeId, nodeData, expanded) {
        const parentNodeEntity = this.nodeEntityMap.get(parentNodeId);

        const nodeState = NodeState.new(this.id, parentNodeEntity.nodeState.id, Id.newNodeId(nodeId, parentNodeEntity.nodeState.id), NodeStateStatus.new(expanded), nodeData)
        await this.#applyNodeAppended(nodeState)
        parentNodeEntity.nodeState.children.push(nodeState);

        this.#eventRecorder.recordEvent(NodeAppendedEvent.new(nodeState))
    }

    /**
     * @param {NodeState} nodeState
     */
    async #applyNodeAppended(nodeState) {
        let parentNodeEntity = {}
        if (nodeState.parentId === null) {
            parentNodeEntity = this.rootNodeEntity;
        } else {
            parentNodeEntity = this.nodeEntityMap.get(nodeState.parentId.value);
        }
        const left = parentNodeEntity.nodeNestedSet.right;
        const right = left + 1;
        const nodeEntity = TreeNodeEntity.new(NodeNestedSet.new(nodeState.id.value, left, right), nodeState);
        parentNodeEntity.addChild(nodeEntity);

        await this.nodeEntityMap.set(nodeState.id.value, nodeEntity);
    }

    async toggleNodeStatusExpanded(nodeId) {
        const nodeEntity = this.nodeEntityMap.get(nodeId);
        const nodeState = nodeEntity.nodeState;
        nodeState.status.expanded = !nodeState.status.expanded;
        await this.#applyNodeChanged(nodeState);
        this.#eventRecorder.recordEvent(NodeChangedEvent.new(nodeState))
    }

    async #applyNodeChanged(nodeState) {
        const nodeEntity = this.nodeEntityMap.get(nodeState.id.value);
        nodeEntity.nodeState = nodeState;
        this.nodeEntityMap.set(nodeState.id.value, nodeEntity);
    }

    deleteNode(nodeId) {
        const node = this.nodeEntityMap.get(nodeId);
        if (node) {
            node.markAsDeleted();
            this.deletedNodes.add(nodeId);
            return true;
        }
        return false;
    }

    /**
     * @param nodeId
     * @return {{FluxUiTreeNodeEntity}|null}
     */
    getNode(nodeId) {
        const node = this.nodeEntityMap.get(nodeId);
        if (node && !node.nodeState.status.deleted) {
            return node;
        }
        return null;
    }

    getState() {
        const nodes = [];

        this.nodeEntityMap.forEach((node, nodeId) => {
            if (!node.nodeState.status.deleted) {
                nodes.push(node.nodeState)
            }
        });
        return TreeState.new(this.id, this.nodeDataSchema, this.rootNodeEntity.nodeState, nodes)
    }

    getDeletedNodes() {
        return Array.from(this.deletedNodes);
    }

    getNestedSets() {
        const nestedSets = [];
        this.nodeEntityMap.forEach(node => {
            if (!node.nodeState.status.deleted) {
                nestedSets.push(node.nodeNestedSet);
            }
        });
        return nestedSets;
    }
}