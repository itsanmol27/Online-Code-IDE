
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
    return (
        <div>
            <Editor className=" h-full p-1"
                height={500}
                defaultLanguage="javascript"
                defaultValue="// Hello world"
                theme="vs-dark"
                onChange={(data) => { console.log(data) }}
            />
        </div>
    )
}

export default CodeEditor