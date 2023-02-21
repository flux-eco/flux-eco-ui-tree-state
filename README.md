# FluxUiTreeState

The FluxUiTreeState API is responsible for creating and managing the state of tree data.

# Usage

``` javascript
import { FluxUiTreeStateApi } from "./FluxUiTreeStateApi.js";

// Initialize the API
const treeStateApi = await FluxUiTreeStateApi.new({
  publish: (subscriberId, oldState, newState) => {
    // Send state change notification
    console.log(`State for topic ${topic} changed: ${JSON.stringify(oldState)} -> ${JSON.stringify(newState)}`);
  },
  subscribe: (subscriberId, id, callback) => {
    // Subscribe to state change notifications
    console.log(`Subscribed to state changes for topic ${topic} with ID ${id}`);
  },
  unsubscribe: (subscriberId, id) => {
    // Unsubscribe from state change notifications
    console.log(`Unsubscribed from state changes for topic ${topic} with ID ${id}`);
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

```