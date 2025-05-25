/**
 * Thanks to <https://mroseman.com/blog/autocomplete-radix-tree> for inspiration.
 */

class Node {
  constructor(label, word=false, data=null) {
    this.label = label
    this.children = {}
    this.word = word
    this.data = data // TODO: optional payload data
  }
}

export class Namespaces {
  constructor(values=[]) {
    this.root = new Node("")
    values.forEach(v => this.add(v))
  }

  add(str) {
    let node = this.root

    for (let i=0; i<str.length; i++) {
      const char = str[i]
      const rest = str.substr(i)

      if (char in node.children) {
        const label = node.children[char].label
        const prefix = commonPrefix(label, rest)

        if (label === rest) {
          node.children[char].word = true
          return
        }

        if (prefix.length < label.length) {
          // edge label contains the rest plus some extra
          // => insert a new word node between the current node and the child, splitting up the edge label
          if (prefix.length === rest.length) {
            const newNode = new Node(rest, true)
  
            // move the child to new node and adjust its label 
            newNode.children[label[prefix.length]] = node.children[char]
            newNode.children[label[prefix.length]].label = label.substr(prefix.length)
  
            node.children[char] = newNode
            return
          }
  
          // edge label and the rest share a common prefix, but differ at some point
          // => insert node between current node and it's child
          if (prefix.length < rest.length) {
            const newNode = new Node(prefix)
  
            newNode.children[label[prefix.length]] = node.children[char]
            newNode.children[label[prefix.length]].label = label.substr(prefix.length)
            node.children[char] = newNode
  
            newNode.children[rest[prefix.length]] = new Node(str.substr(i+prefix.length), true)
            return
          }
        }
  
        i += label.length - 1
        node = node.children[char]
      } else {
        node.children[char] = new Node(rest, true)
        return
      }
    }
  }

  lookup(str) {
    let ns = ""
    let node = this.root

    for (let i=0; i<str.length; i++) {
      const char = str[i]

      if (char in node.children) {
        const label = node.children[char].label
        const rest = str.substr(i)
        const prefix = commonPrefix(label, rest)

        if (prefix.length !== label.length && prefix.length !== rest.length) {
          return
        }

        ns = ns.concat(node.children[char].label)
        i += node.children[char].label.length - 1
        node = node.children[char]
      } else {
        // string starts with a namespace
        return ns
      }
    }

    // string may be equal to a namespace
    return node.word ? str : undefined
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
