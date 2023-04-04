import { Readable } from "stream";
import assert from 'node:assert/strict';
import { FormData } from "formdata-node";
import { toStringRepresentation, removeRandomnessOfForm, crlfToLf } from "./utils.mjs";

const form = new FormData();

const content = Buffer.from("Stream content");

const stream = new Readable({
  read() {
    this.push(content);
    this.push(null);
  },
});

form.set("stream", {
  type: "text/plain",
  name: "file.txt",
  [Symbol.toStringTag]: "File",
  stream() {
    return stream;
  },
});

const formString = await toStringRepresentation(form)
      .then(removeRandomnessOfForm)
      .then(crlfToLf)

const expected = `--form-data-boundary-xxxxxxxxxxxxxxxx
Content-Disposition: form-data; name="stream"; filename="file.txt"
Content-Type: text/plain

Stream content
--form-data-boundary-xxxxxxxxxxxxxxxx--

`

assert.deepStrictEqual(formString, expected);
