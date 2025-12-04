/*
debugPanel.ts
    makes the debug panel
    (vibecoded) I couldn't bother to understand this in great detail so it's primarily copy pasted from chatGPT
*/

import { Modal, App, Setting} from 'obsidian';
import type latexPro from '../main'

export async function handleAppendDebugPanel(plugin: latexPro){
    // Ensure the panel exists
    if (!plugin.panel) plugin.panel = new debugPanel();
    plugin.panel.open();

    const textPrompt = new TextPromptModal(plugin.app, "Enter debug text:");
    const text = await textPrompt.openAndWait();
    if (!text) return;

    const keyPrompt = new TextPromptModal(plugin.app, "Enter key (optional):");
    const key = await keyPrompt.openAndWait();

    plugin.panel.appendContent(text, key || undefined);
}

export class TextPromptModal extends Modal {
    result: string | null = null;
    promptText: string;
    resolvePromise!: (value: string | null) => void;

    constructor(app: App, promptText: string) {
        super(app);
        this.promptText = promptText;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl("h3", { text: this.promptText });

        let inputEl: HTMLInputElement;

        new Setting(contentEl)
            .addText(text => {
                inputEl = text.inputEl;
                inputEl.focus();

                text.onChange(value => {
                    this.result = value;
                });

                // 🔥 Add ENTER key support (emoji is left in on purpose for enhanced vibe coding experience)
                inputEl.addEventListener("keydown", (evt) => {
                    if (evt.key === "Enter") {
                        evt.preventDefault(); // don’t close modal accidentally
                        this.close();
                        this.resolvePromise(this.result);
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn =>
                btn.setButtonText("OK")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.resolvePromise(this.result);
                    })
            );
    }

    onClose() {
        this.contentEl.empty();
    }

    openAndWait(): Promise<string | null> {
        this.open();
        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    }
}

// makes a floating panel for which entire text content can be updated with updateContet(string)
export class debugPanel {
    container: HTMLDivElement;
    header: HTMLDivElement;
    content: HTMLDivElement;

    private offsetX = 0;
    private offsetY = 0;
    private isDragging = false;

    constructor() {
        // Container
        this.container = document.createElement('div'); // creates div in the DOM
        this.container.style.position = 'fixed'; // relative to viewport not any parent element
        this.container.style.bottom = '20px';  // distance from bottom
        this.container.style.right = '20px';   // distance from right
        // this.container.style.top = '50px';
        // this.container.style.left = '50px';
        this.container.style.width = '400px';
        this.container.style.height = '200px';
        this.container.style.minWidth = '300px'; // when resizing don't go below this
        this.container.style.minHeight = '100px'; // and this
        this.container.style.backgroundColor = 'white';
        this.container.style.border = '1px solid black';
        this.container.style.zIndex = '1000'; // stacking order: high value ensures panel is on top
        this.container.style.display = 'flex'; // easy layout of the panel's children
        this.container.style.flexDirection = 'column'; // arranges children vertivally
        this.container.style.borderRadius = '6px'; // rounded corners
        this.container.style.resize = 'both';
        this.container.style.overflow = 'auto';

        

        // Header for dragging and closing
        this.header = document.createElement('div');
        this.header.textContent = 'Debug Panel latexPro';
        this.header.style.cursor = 'move'; // when cursos atop of this change to move cursor
        this.header.style.display = 'flex';
        this.header.style.backgroundColor = '#eee';
        this.header.style.borderTopLeftRadius = '6px';
        this.header.style.borderTopRightRadius = '6px';
        this.header.style.alignItems = 'flex-end'; // aligns content to bottom
        this.header.style.paddingLeft = '7px'; // small left padding
        // distributes space evenly between children ensuring header is left and close button is right
        this.header.style.justifyContent = 'space-between';
        this.header.style.fontWeight = 'bold';
        this.header.style.borderBottom = '1px solid #ccc';

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '4px' // spacing between buttons

        // Clear Button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'C';
        clearButton.onclick = () => this.clearContent();
        buttonsContainer.appendChild(clearButton)
        // Closoe button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.onclick = () => this.close();
        buttonsContainer.appendChild(closeButton); // adds button as child of header
        
        this.header.appendChild(buttonsContainer) // add buttons to header

        // Content
        this.content = document.createElement('div');
        this.content.textContent = '';
        this.content.style.padding = '5px 15px';
        this.content.style.flex = '1'; // fill remaining vertical space beneath header
        this.content.style.overflowY = 'auto';  // vertical scrolling
        this.content.style.whiteSpace = 'pre-wrap'; // horizontal text wrapping
        this.content.style.display = 'flex';
        this.content.style.flexDirection = 'column';
        this.content.style.justifyContent = 'flex-start'; // flex-start for top left
        this.content.style.alignItems = 'flex-start';
        this.content.style.userSelect = 'text'; // makes text selectable
        this.content.style.cursor = 'text'; // change cursor to text selector

        // Combine
        this.container.appendChild(this.header);
        this.container.appendChild(this.content);

        // Dragging behavior
        this.header.addEventListener('mousedown', e => this.startDrag(e));
        document.addEventListener('mousemove', e => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }

    open() {
        if (!document.body.contains(this.container)) { // checks if not open yet
            document.body.appendChild(this.container);
        }
    }

    close() {
        this.container.remove();
    }

    clearContent(){
        this.content.innerHTML = '';
    }

    appendContent(newText: string, key?: string){
        // if key is provided, remove any existing line with that key
        if (key){
            const existingLine = this.content.querySelector<HTMLDivElement>(`div[data-key="${key}"]`)
            if (existingLine){ existingLine.remove();}
        }

        const line = document.createElement('div');
        if (key) line.dataset.key = key; // store key in div if provided

        // some (css) formatting
        line.textContent = `> ${newText}`; // adds the >
        line.style.display = 'block';
        line.style.whiteSpace = 'pre-wrap';
        line.style.fontFamily = 'monospace';
        line.style.paddingLeft = '1ch' // adds padding for text
        line.style.textIndent = '-2ch' // pulls `> ` to the left
        line.style.margin = '2px 0'; // adds whitespace between entries

        // append to content container
        this.content.appendChild(line)

        // scroll to bottom.
        this.content.scrollTop = this.content.scrollHeight
    }

    private startDrag(e: MouseEvent) {
        this.isDragging = true;
        this.offsetX = e.clientX - this.container.offsetLeft; // diff between left edge and x-mouse posn
        this.offsetY = e.clientY - this.container.offsetTop; // similar, these two don't make box jump to mouse posn
        e.preventDefault(); // prevents default browser behavior like text selection
    }

    private drag(e: MouseEvent) {
        if (!this.isDragging) return; // if not dragging immediately stop function
        this.container.style.left = `${e.clientX - this.offsetX}px`;
        this.container.style.top = `${e.clientY - this.offsetY}px`;
    }

    private stopDrag() {
        this.isDragging = false;
    }
}
