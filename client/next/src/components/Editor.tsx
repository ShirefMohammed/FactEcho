"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import "react-quill/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface EditorProps {
  value: string;
  setValue: (value: string) => void;
}

const Editor = ({ value, setValue }: EditorProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading editor...</div>;

  const modules = {
    toolbar: [
      [{ header: [2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
      [{ direction: "rtl" }],
    ],
  };

  return (
    <div suppressHydrationWarning>
      {/* <ReactQuill
        theme="snow"
        modules={modules}
        value={value}
        onChange={(value) => setValue(value)}
        style={{ direction: "rtl", textAlign: "right" }}
        id="editor"
      /> */}
    </div>
  );
};

export default Editor;
