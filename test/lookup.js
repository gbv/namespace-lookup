import { expect } from "chai"
import { Namespaces, NamespacesArray } from "../index.js"

function testWith(namespaces) {
  namespaces.add("http://purl.org/dc/elements/1.1/")
  namespaces.add("http://purl.org/dc/terms/")

  const tests = {
    "http://purl.org/dc/terms/title": "http://purl.org/dc/terms/",
    "http://purl.org/dc/terms/": "http://purl.org/dc/terms/",
    "http://schema.org/title": undefined,
    "http://purl.org/dc/": undefined,
    "http://purl.org/dc/elements/1.1/": "http://purl.org/dc/elements/1.1/",
    "http://purl.org/dc/elements/1.1/title": "http://purl.org/dc/elements/1.1/",
  }

  Object.entries(tests).forEach(([key, value]) => {
    it(key, () => {
      expect(namespaces.lookup(key)).to.equal(value)
    })
  })
}

describe("Namespaces", () => testWith(new Namespaces()))
describe("NamespacesArray", () => testWith(new NamespacesArray()))



