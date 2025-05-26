/**
 * Thanks to <https://mroseman.com/blog/autocomplete-radix-tree> for inspiration.
 */

class Node {
  constructor(label, word=false, data=null) {
    this.label = label
    this.children = {}
    this.word = word
    this.data = data
  }
}

export class Namespaces {
  constructor(values=[]) {
    this.root = new Node("")
    if (Array.isArray(values)) {    
      values.forEach(v => this.add(v))
    } else if (typeof values === "object") {
      Object.entries(values).forEach(entry => this.add(...entry))
    }
  }

  add(str, data) {
    let node = this.root

    for (let i=0; i<str.length; i++) {
      const chr = str[i]
      const rest = str.substr(i)

      if (chr in node.children) {
        const label = node.children[chr].label
        const prefix = commonPrefix(label, rest)

        if (label === rest) {
          node.children[chr].word = true
          return
        }

        if (prefix.length < label.length) {
          // edge label contains the rest plus some extra
          // => insert a new word node between the current node and the child, splitting up the edge label
          if (prefix.length === rest.length) {
            const newNode = new Node(rest, true, data)

            // move the child to new node and adjust its label 
            newNode.children[label[prefix.length]] = node.children[chr]
            newNode.children[label[prefix.length]].label = label.substr(prefix.length)
  
            node.children[chr] = newNode
            return
          }
  
          // edge label and the rest share a common prefix, but differ at some point
          // => insert node between current node and it's child
          if (prefix.length < rest.length) {
            const newNode = new Node(prefix)
 
            newNode.children[label[prefix.length]] = node.children[chr]
            newNode.children[label[prefix.length]].label = label.substr(prefix.length)
            node.children[chr] = newNode
  
            newNode.children[rest[prefix.length]] = new Node(str.substr(i+prefix.length), true, data)
            return
          }
        }
  
        i += label.length - 1
        node = node.children[chr]
      } else {
        node.children[chr] = new Node(rest, true, data)
        return
      }
    }
  }

  lookup(str) {
    let ns = ""
    let node = this.root

    for (let i=0; i<str.length; i++) {
      const chr = str[i]

      if (chr in node.children) {
        const label = node.children[chr].label
        const rest = str.substr(i)
        const prefix = commonPrefix(label, rest)

        if (prefix.length !== label.length && prefix.length !== rest.length) {
          return
        }

        ns = ns.concat(node.children[chr].label)
        i += node.children[chr].label.length - 1
        node = node.children[chr]
      } else {
        // string starts with a namespace
        return node.word ? (node.data === null ? ns : node.data) : undefined
      }
    }

    // string is equal to a namespace
    if (node.word) {
      return node.data === null ? str : node.data
    }
  }
}

function commonPrefix(a, b) {
  let prefix = ""
  for (let i=0; i<Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return prefix
    }
    prefix += a[i]
  }
  return prefix
}

export class NamespacesArray extends Set {
  lookup(str) {
    for (let namespace of this) {
      if (str.startsWith(namespace)) {
        return namespace
      }
    }
  }
}
