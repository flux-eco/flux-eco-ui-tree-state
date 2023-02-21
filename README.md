# FluxUiTreeState

The FluxUiTreeState API is responsible for creating and managing the state of tree data.

# Typedef


# Typedefs

## Id

``` js
/**
 * @typedef {Id}
 * @property {string} value
 * @property {string} path
 */
```

## TreeState

``` js
/**
 * @typedef TreeState
 * @property {Id} id - The tree ID object of the node
 * @property {object} nodeDataSchema
 * @property {NodeState} rootNode
 * @property {NodeState[]} nodes
*/
```

## NodeState

``` js
/**
 * @typedef NodeState
 * @property {Id} treeId - The tree ID object of the node
 * @property {null|Id} parentId - The parent ID object of the node - null in case of rootNodeEntity
 * @property {Id} id - The id as ID object of the node.
 * @property {NodeStateStatus} status - The status of the node, e.g. whether it is expanded or deleted.
 * @property {null|Object} data - The data of the node, conforming to the schema declared at tree level - null in case of rootNodeEntity
 * @property {Object.<string, Object>} apiActionPayloads - The actions with payload that can be performed on the api.
 * @property {NodeState[]} children - array of child nodes
*/
```

# Usage

``` javascript
import { FluxUiTreeStateApi } from "./FluxUiTreeStateApi.js";

// Initialize the API
const treeStateApi = await FluxUiTreeStateApi.new({
  publish: (subscriberId, oldState, newState) => {
    // Send state change notification
    console.log(`Notify ${subscriberId} about tree changes: ${JSON.stringify(oldState)} -> ${JSON.stringify(newState)}`);
  },
  subscribe: (subscriberId, id, callback) => {
    // Subscribe to state change notifications
    console.log(`Subscribed to state changes for ${subscriberId} for treeId ${id}`);
  },
  unsubscribe: (subscriberId, id) => {
    // Unsubscribe from state change notifications
    console.log(`Unsubscribed from state changes for ${subscriberId} with treeId ${id}`);
  }
});

// Create a tree
const treeId = "my-tree";
const nodeDataSchema = {
  type: "object",
  properties: {
    label: { type: "string" }
  }
};
await treeStateApi.createTree(treeId, nodeDataSchema);

// Append a node to the root
const nodeId = "my-first-node";
const nodeData = { label: "My First Node" };
await treeStateApi.appendNodeToRoot(treeId, nodeId, nodeData);

// Append a child node to a parent node
const childNodeId = "a-child-node";
const childNodeData = { label: "A Child Node" };
await treeStateApi.appendNodeToParentNode(treeId, "my-first-node", childNodeId, childNodeData);

// Get the state of the tree
const treeState = await treeStateApi.getState(treeId);

// Subscribe to state changes
await treeStateApi.subscribeToStateChanged("mySubscriber", treeId, (stateChange) => {
  console.log(`State change detected for tree ${treeId}: ${JSON.stringify(stateChange)}`);
});

// Toggle the node with id "my-first-node"
treeStateApi.toggleNodeStatusExpanded(treeId, "my-first-node")

```