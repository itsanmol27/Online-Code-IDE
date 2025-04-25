
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../utils/socket";

const CodeEditor = () => {

    const [fileContent, setFileContent] = useState<string>('');
    const [path, setPath] = useState<string>('');

    useEffect(() => {
        socket.on("fetch:file", (data: { data: string, path: string }) => {
            console.log(data);
            setFileContent(data.data);
            setPath(data.path);
        })
    }, [])

    function handleFileChange(data: string | undefined) {
        if (data && path) {
            setFileContent(data);
            socket.emit("file:append", { path, data })
        }
    }

    return (
        <div>
            <Editor className=" h-full p-1"
                value={fileContent}
                height={500}
                defaultLanguage="javascript"
                theme="vs-dark"
                onChange={(data) => { handleFileChange(data) }}
            />
        </div>
    )
}

export default CodeEditor