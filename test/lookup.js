import { expect } from "chai"
import { Namespaces, NamespacesArray } from "../index.js"

function testWith(namespaces, prefixes=[], tests) {
  prefixes.forEach(value => namespaces.add(value))

  Object.entries(tests).forEach(([key, value]) => {
    it(key, () => {
      expect(namespaces.lookup(key)).to.equal(value)
    })
  })
}

let prefixes = [
  "http://purl.org/dc/elements/1.1/",
  "http://purl.org/dc/terms/X",
  "http://purl.org/dc/terms/",
]
let tests = {      
  "http://purl.org/dc/terms/title": "http://purl.org/dc/terms/",
  "http://purl.org/dc/terms/": "http://purl.org/dc/terms/",
  "http://purl.org/dc/terms/XY": "http://purl.org/dc/terms/X",
  "http://schema.org/title": undefined,
  "http://purl.org/dc/": undefined,
  "http://purl.org/dc/elements/1.1/": "http://purl.org/dc/elements/1.1/",
  "http://purl.org/dc/elements/1.1/title": "http://purl.org/dc/elements/1.1/",
}

describe("NamespacesArray", () => testWith(new NamespacesArray(),prefixes,tests))
describe("NamespacesArray(prefixes)", () => testWith(new NamespacesArray(prefixes),[],tests))

describe("Namespaces", () => testWith(new Namespaces(),prefixes,tests))
describe("Namespaces(prefixes)", () => testWith(new Namespaces(prefixes),[],tests))

let ns = new Namespaces()
prefixes = {
  "http://purl.org/dc/elements/1.1/": "dce",
  "http://purl.org/dc/terms/X": "", // empty string
  "http://purl.org/dc/terms/": "dct",
}
Object.entries(prefixes).forEach(entry => ns.add(...entry))

tests = {      
  "http://purl.org/dc/terms/title": "dct",
  "http://purl.org/dc/terms/": "dct",
  "http://purl.org/dc/terms/XY": "",
  "http://purl.org/dc/": undefined,
  "http://purl.org/dc/elements/1.1/": "dce",
  "http://purl.org/dc/elements/1.1/title": "dce",
}

ns = new Namespaces(prefixes)
describe("Namespaces with payload", () => testWith(ns,[],tests))
describe("Namespaces(object) with payload", () => testWith(ns,[],tests))
