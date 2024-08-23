"use client";
import { useCallback, useState } from "react";

export default function Home() {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);

  const readPdf = useCallback(async () => {
    setOutput(null);
    setError(null);
    setWorking(true);

    var input: HTMLInputElement | null =
      document.querySelector('input[type="file"]');

    if (input === null) {
      throw new Error("could not find input[type=file]");
    }

    if (!input.files || !input.files[0]) {
      throw new Error("no file selected");
    }

    var data = new FormData();
    data.append("file", input.files[0]);

    let resp = await fetch("/api/read-pdf", {
      method: "POST",
      body: data,
    });

    if (!resp.ok) {
      setError("Failed to read PDF");
      setWorking(false);
      return;
    }
    setWorking(false);
    setOutput(await resp.text());
  }, []);

  return (
    <div>
      <form
        method="POST"
        target="_blank"
        encType="multipart/form-data"
        action="/read-pdf"
      >
        <div>
          PDF file: <input type="file" name="file" />
        </div>
      </form>
      <button
        className="border border-black p-3"
        onClick={readPdf}
        value="Upload"
      >
        Read PDF
      </button>

      {working && <div>Working...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {output && <pre>{output}</pre>}
    </div>
  );
}
