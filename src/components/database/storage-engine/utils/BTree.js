class BTreeNode {
  constructor(leaf = true) {
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
  }
}

export class BTree {
  constructor(degree = 3) {
    this.root = new BTreeNode();
    this.degree = degree;
    console.log(`Creating B-tree with degree ${degree}`);
  }

  insert(key, value) {
    console.log(`Inserting key: ${key}, value: ${value}`);
    if (this.root.keys.length === (2 * this.degree) - 1) {
      console.log('Root is full, splitting...');
      let newRoot = new BTreeNode(false);
      newRoot.children.push(this.root);
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this._insertNonFull(this.root, key, value);
    console.log('Insertion complete');
  }

  _insertNonFull(node, key, value) {
    let i = node.keys.length - 1;
    if (node.leaf) {
      node.keys.push(null);
      while (i >= 0 && key < node.keys[i].key) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = { key, value };
    } else {
      while (i >= 0 && key < node.keys[i].key) {
        i--;
      }
      i++;
      if (node.children[i].keys.length === (2 * this.degree) - 1) {
        console.log(`Splitting child at index ${i}`);
        this._splitChild(node, i);
        if (key > node.keys[i].key) {
          i++;
        }
      }
      this._insertNonFull(node.children[i], key, value);
    }
  }

  _splitChild(parentNode, index) {
    console.log(`Splitting child at index ${index}`);
    let nodeToSplit = parentNode.children[index];
    let newNode = new BTreeNode(nodeToSplit.leaf);
    parentNode.children.splice(index + 1, 0, newNode);
    parentNode.keys.splice(index, 0, nodeToSplit.keys[this.degree - 1]);
    
    newNode.keys = nodeToSplit.keys.splice(this.degree, this.degree - 1);
    
    if (!nodeToSplit.leaf) {
      newNode.children = nodeToSplit.children.splice(this.degree, this.degree);
    }
    
    console.log('Split complete');
  }

  search(key) {
    return this._search(this.root, key);
  }

  _search(node, key) {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i].key) {
      i++;
    }
    if (i < node.keys.length && key === node.keys[i].key) {
      return node.keys[i].value;
    } else if (node.leaf) {
      return null;
    } else {
      return this._search(node.children[i], key);
    }
  }

  // Method to get a representation of the tree for visualization
  getTreeRepresentation() {
    return this._getNodeRepresentation(this.root);
  }

  _getNodeRepresentation(node) {
    if (!node) return null;
    return {
      keys: node.keys.map(k => k.key),
      values: node.keys.map(k => k.value),
      isLeaf: node.leaf,
      children: node.children.map(child => this._getNodeRepresentation(child))
    };
  }
}