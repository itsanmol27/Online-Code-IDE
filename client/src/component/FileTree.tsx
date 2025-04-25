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
        socket.on("file:changed", getFileTree)

        return () => {
            socket.off('file:changed');
        }

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

    const renderTree = (tree: FileTreeType, depth = 0) => {
        if (!tree) return null;

        return Object.entries(tree).map(([name, children]) => {
            const isDirectory = children !== null && typeof children === 'object';
            const paddingLeft = `${depth * 15}px`;

            return (
                <div key={name} style={{ paddingLeft }}>
                    {isDirectory ? (
                        <details>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                📁 {name}
                            </summary>
                            {renderTree(children, depth + 1)}
                        </details>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    {renderTree(fileTree)}
                </div>
            ) : (
                <div>Loading file tree...</div>
            )}
        </div>
    );
};

export default FileTree;