export function safeInsertBefore(parent, newNode, referenceNode) {
  if (parent && newNode) {
    if (referenceNode && parent.contains(referenceNode)) {
      parent.insertBefore(newNode, referenceNode);
    } else {
      parent.appendChild(newNode);
    }
  }
}
