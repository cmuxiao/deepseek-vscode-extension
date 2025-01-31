Certainly! Here's an improved version of your README file with better structure, clarity, and additional details to make it more professional and user-friendly:

---

# Run DeepSeek Locally as a VSCode Extension

This guide will walk you through setting up DeepSeek, an AI-powered assistant, as a local VSCode extension using Ollama. This extension allows you to interact with DeepSeek directly within VSCode.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [VSCode](https://code.visualstudio.com/)
- [Ollama](https://ollama.ai/) (for running the DeepSeek model locally)

---

## Installation

### 1. **Set Up the VSCode Extension**

1. **Generate the Extension:**
   Open a terminal and run the following command to create a new VSCode extension:
   ```bash
   npx --package yo --package generator-code -- yo code
   ```
   - Choose the default settings when prompted.
   - This will generate a new VSCode extension project.

2. **Install Ollama:**
   Install the Ollama package to interact with the DeepSeek model:
   ```bash
   npm install ollama
   ```

3. **Download the DeepSeek Model:**
   Use the following command to download and run the DeepSeek model locally. The `7b` version is recommended for a balance between speed and accuracy:
   ```bash
   ollama run deepseek-r1:7b
   ```
   - To verify that the model is running, use:
     ```bash
     ollama list
     ```

4. **Replace the Extension Files:**
   Replace the generated `extension.ts` and `package.json` files with the ones provided in this project.

---

## Running the Extension

1. **Start Debugging:**
   - Open the extension project in VSCode.
   - Press `Ctrl + P` (Windows/Linux) or `Cmd + P` (Mac) and type:
     ```
     > Debug: Start debugging
     ```
   - A new VSCode window will open with the extension loaded.

2. **Start Chatting with DeepSeek:**
   - In the new VSCode window, press `Ctrl + P` or `Cmd + P` and type:
     ```
     > Chat With DeepSeek
     ```
   - A chat interface will appear, allowing you to interact with DeepSeek directly within VSCode.

---

## Features

- **Local AI Assistant:** Run DeepSeek locally using Ollama for privacy and offline use.
- **Real-Time Chat:** Interact with DeepSeek in a chat-like interface within VSCode.
- **Streaming Responses:** Responses are streamed in real-time for a smooth experience.
- **Customizable Model:** Use different versions of the DeepSeek model (e.g., `7b`, `13b`) based on your needs.

---

## Troubleshooting

### 1. **Model Not Found**
If you encounter an error like `model "deepseek-r1:7b" not found`, ensure you have downloaded the model using:
```bash
ollama run deepseek-r1:7b
```

### 2. **Ollama Not Running**
If Ollama is not running, start it using:
```bash
ollama serve
```

### 3. **Extension Not Working**
- Ensure you have replaced the `extension.ts` and `package.json` files correctly.
- Restart VSCode and try running the extension again.

---

## Customization

### Change the Model
To use a different version of the DeepSeek model (e.g., `13b`), update the `model` parameter in the `extension.ts` file:
```typescript
const streamResponse = await Ollama.chat({
    model: 'deepseek-r1:13b', // Change to your preferred model
    messages: [{ role: 'user', content: userPrompt }],
    stream: true
});
```

### Add Markdown Support
To render bot responses with Markdown formatting, update the `appendMessage` function in the HTML template.

---

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the infrastructure to run local AI models.
- [DeepSeek](https://www.deepseek.com/) for the AI model.

---

Enjoy using DeepSeek locally within VSCode! Let us know if you have any feedback or run into issues.

---
