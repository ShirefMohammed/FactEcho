import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Define the type for the Editor props
interface EditorProps {
  value: string;
  setValue: (value: string) => void;
}

const Editor = ({ value, setValue }: EditorProps) => {
  // Toolbar configuration for Quill editor
  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
        [{ direction: "rtl" }],
      ],
    },
  };

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={value}
      onChange={(value) => setValue(value)}
      style={{ direction: "rtl", textAlign: "right" }}
      id="editor"
    />
  );
};

export default Editor;
