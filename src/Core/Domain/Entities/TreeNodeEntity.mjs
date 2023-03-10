import {NodeNestedSet} from "../ValueObjects/NodeNestedSet.mjs";
import {NodeState} from "../ValueObjects/NodeState.mjs";

export class TreeNodeEntity {
    /**
     * @var {NodeNestedSet}
     */
    nodeNestedSet;
    /**
     * @var {NodeState}
     */
    nodeState;

    constructor(nodeNestedSet, nodeState) {
        this.nodeNestedSet = nodeNestedSet;
        this.nodeState = nodeState;
        this.children = new Map();
        this.parent = null;
    }

    /**
     * @param {NodeNestedSet} nodeNestedSet
     * @param {NodeState} nodeState
     * @return {TreeNodeEntity}
     */
    static new(nodeNestedSet, nodeState) {
        return new TreeNodeEntity(nodeNestedSet, nodeState);
    }

    /**
     * @param {TreeNodeEntity} node
     */
    addChild(node) {
        this.children.set(node.nodeNestedSet.id, node);
        node.setParent(this);
    }

    /**
     * @param {TreeNodeEntity} parent
     */
    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    isLeaf() {
        return this.children.size === 0;
    }

    isDeleted() {
        return this.nodeState.status.deleted;
    }

    markAsDeleted() {
        this.nodeState.status.deleted = true;
    }

    traverse(callback) {
        callback(this);
        this.children.forEach((child) => {
            child.traverse(callback);
        });
    }
}