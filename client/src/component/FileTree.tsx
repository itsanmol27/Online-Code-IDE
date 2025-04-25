import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../utils/socket";

type FileTreeType = {
    [key: string]: FileTreeType | null;
};

const FileTree = () => {
    const [fileTree, setFileTree] = useState<FileTreeType>({});

    useEffect(() => {
        getFileTree();
        socket.on("file:changed", getFileTree);

    }, []);

    async function getFileTree() {
        try {
            const response = await axios.post("http://localhost:4000/files", { "directory": "./" });
            console.log("File tree response:", response.data);
            setFileTree(response.data);
        } catch (error) {
            console.error("Error fetching file tree:", error);
        }
    }

    async function fetchFile(path: string) {
        console.log(path);
        socket.emit("fetch:file", path);
    }

    const renderTree = (tree: FileTreeType, depth = 0, currentPath = "") => {
        if (!tree) return null;

        return Object.entries(tree).map(([name, children]) => {
            const isDirectory = children !== null && typeof children === 'object';
            const fullPath = `${currentPath}/${name}`;
            const paddingLeft = `${depth * 15}px`;

            return (
                <div key={fullPath} style={{ paddingLeft }}>
                    {isDirectory ? (
                        <details>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                📁 {name}
                            </summary>
                            {renderTree(children, depth + 1, fullPath)}
                        </details>
                    ) : (
                        <div className=" cursor-pointer" onClick={() => { fetchFile(fullPath) }} style={{ display: 'flex', alignItems: 'center' }}>
                            📄 {name}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="text-white w-full h-full p-4 overflow-y-scroll">
            {fileTree ? (
                <div className="file-tree">
                    {renderTree(fileTree, 0, ".")}
                </div>
            ) : (
                <div>Loading file tree...</div>
            )}
        </div>
    );
};

export default FileTree;