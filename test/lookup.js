import { expect } from "chai"
import { Namespaces } from "../index.js"

describe("Namespaces lookup", () => {
  const namespaces = new Namespaces()

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
})
