import { test, expect } from "vitest";
import { FormData } from "formdata-node";
import {
  toStringRepresentation,
  removeRandomnessOfForm,
  crlfToLf,
  createReadableStream,
} from "./utils.mjs";

test("add files", async () => {
  const form = new FormData();
  const stream = createReadableStream("Stream content");

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
    .then(crlfToLf);
  expect(formString).toMatchSnapshot();
});
