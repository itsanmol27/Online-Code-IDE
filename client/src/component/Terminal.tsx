import { Terminal as XTerminal } from "@xterm/xterm"
import { useEffect, useRef } from "react"
import "@xterm/xterm/css/xterm.css"
import socket from "../utils/socket"

const Terminal = () => {

    const termRef = useRef(null);
    // const isRendered = useRef(false);

    useEffect(() => {

        // if (isRendered.current) return;
        // isRendered.current = true;


        const terminal = new XTerminal({
            rows: 15
        });

        if (termRef.current) {
            terminal.open(termRef.current);
        }

        terminal.onData((data) => {
            socket.emit("terminal:input", data);
        })

        socket.on("terminal:output", (data) => {
            console.log(data);
            terminal.write(data);
        })

        return (() => {
            terminal.dispose();
        })
    }, [])

    return (
        <div ref={termRef} id="Terminal">

        </div>
    )
}

export default Terminal