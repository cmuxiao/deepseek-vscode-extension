import * as vscode from 'vscode';
import Ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
    console.log("Activating DeepSeek extension");

    const disposable = vscode.commands.registerCommand("dsr1-ext.start", () => {
        const panel = vscode.window.createWebviewPanel(
            'deepChat',
            'DeepSeek Chat',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';

                try {
                    const streamResponse = await Ollama.chat({
                        model: 'deepseek-r1:7b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true
                    });

                    for await (const response of streamResponse) {
                        responseText += response.message.content;
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                } catch (err) {
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}` });
                }
            }
        }, undefined, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f7f7f7;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                #chat-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    background-color: #fff;
                    border-bottom: 1px solid #ddd;
                }
                .message {
                    display: flex;
                    margin-bottom: 1rem;
                }
                .message.user {
                    justify-content: flex-end;
                }
                .message.bot {
                    justify-content: flex-start;
                }
                .message-content {
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    position: relative;
                }
                .message.user .message-content {
                    background-color: #0078d4;
                    color: #fff;
                }
                .message.bot .message-content {
                    background-color: #f1f1f1;
                    color: #333;
                }
                #input-container {
                    display: flex;
                    padding: 1rem;
                    background-color: #fff;
                    border-top: 1px solid #ddd;
                }
                #prompt {
                    flex: 1;
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    margin-right: 0.5rem;
                }
                #askBtn {
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    color: #fff;
                    background-color: #0078d4;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                #askBtn:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
                #askBtn:hover:not(:disabled) {
                    background-color: #005bb5;
                }
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #0078d4;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                    display: none;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div id="chat-container">
                <!-- Chat messages will be appended here -->
            </div>
            <div id="input-container">
                <textarea id="prompt" rows="1" placeholder="Type your message..."></textarea>
                <button id="askBtn">Send</button>
            </div>
            <div class="loader" id="loader"></div>

            <script>
                const vscode = acquireVsCodeApi();
                const chatContainer = document.getElementById('chat-container');
                const promptInput = document.getElementById('prompt');
                const askBtn = document.getElementById('askBtn');
                const loader = document.getElementById('loader');

                let botMessageDiv = null; // To store the bot's message bubble

                const appendMessage = (role, content) => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${role}\`;
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'message-content';
                    contentDiv.innerText = content;
                    messageDiv.appendChild(contentDiv);
                    chatContainer.appendChild(messageDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
                    return contentDiv; // Return the content div for updates
                };

                const sendMessage = () => {
                    const text = promptInput.value.trim();
                    if (text) {
                        askBtn.disabled = true;
                        loader.style.display = 'block';
                        promptInput.value = '';
                        appendMessage('user', text);
                        botMessageDiv = appendMessage('bot', '...'); // Create a placeholder for the bot's response
                        vscode.postMessage({ command: 'chat', text });
                        promptInput.focus(); // Retain focus on the textarea
                    }
                };

                askBtn.addEventListener('click', sendMessage);

                promptInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault(); // Prevent default behavior (e.g., new line)
                        sendMessage();
                    }
                });

                window.addEventListener('message', (event) => {
                    const { command, text } = event.data;
                    if (command === 'chatResponse') {
                        if (botMessageDiv) {
                            botMessageDiv.innerText = text; // Update the bot's message with the complete response
                            chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
                        }
                        askBtn.disabled = false;
                        loader.style.display = 'none';
                    }
                });
            </script>
        </body>
        </html>
    `;
}

export function deactivate() {}
