import { expect } from "chai"
import { Namespaces, NamespacesArray } from "../index.js"

function testWith(namespaces, values=[], tests) {
  values.forEach(value => namespaces.add(value))

  Object.entries(tests).forEach(([key, value]) => {
    it(key, () => {
      expect(namespaces.lookup(key)).to.equal(value)
    })
  })
}

let values = ["http://purl.org/dc/elements/1.1/", "http://purl.org/dc/terms/"]
let tests = {      
  "http://purl.org/dc/terms/title": "http://purl.org/dc/terms/",
  "http://purl.org/dc/terms/": "http://purl.org/dc/terms/",
  "http://schema.org/title": undefined,
  "http://purl.org/dc/": undefined,
  "http://purl.org/dc/elements/1.1/": "http://purl.org/dc/elements/1.1/",
  "http://purl.org/dc/elements/1.1/title": "http://purl.org/dc/elements/1.1/",
}


describe("NamespacesArray", () => testWith(new NamespacesArray(),values,tests))
describe("NamespacesArray(values)", () => testWith(new NamespacesArray(values),[],tests))

describe("Namespaces", () => testWith(new Namespaces(),values,tests))
describe("Namespaces(values)", () => testWith(new Namespaces(values),[],tests))
