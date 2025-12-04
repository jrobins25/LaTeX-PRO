/*
mdPostProcessing.ts
    helper functions associated with processing edit & read mode of markdown files in obsidian
*/
import { App } from 'obsidian';
import {EditorView, Decoration, DecorationSet ,WidgetType} from "@codemirror/view";
import { RangeSetBuilder, RangeSet, StateField, StateEffect} from "@codemirror/state";
import latexPro from 'main';

export function displayInlinePlaceholder(
    view : EditorView,
    placeholders: RangeSet<Decoration>
    ){
        const placeholderField = StateField.define<DecorationSet>({
            create(){return placeholders;},
            update(deco, tr){return deco.map(tr.changes)}, // only position tracking: no debounce needed
            provide: f => EditorView.decorations.from(f)
        })

        view.dispatch({
            effects: StateEffect.appendConfig.of([placeholderField])
        })
    }

export function decorateInlineTags(
    view: EditorView,
    ranges: {start: number, end: number}[]
    ){
        const builder = new RangeSetBuilder<Decoration>();
        const decorations: {start: number, end:number, mark: Decoration}[]=[];

        for (const range of ranges){
            // extract text for most up-to-date data         
            const text = view.state.doc.sliceString(range.start, range.end)

            const startTagRegex = text.match(/^\$latexPro:/)
            const endTagRegex = text.match(/\$$/)
            const commandRegex = /\\[a-zA-Z]+/g
            const braceRegex = /[{}]/g;
            // const textRegex = /\\[a-zA-Z]+|[{}]/g;

            let match;
            // latex commands
            while ((match = commandRegex.exec(text))!== null){
                const start = range.start + match.index;
                const end = start + match[0].length;
                decorations.push({start: start, end: end, mark: Decoration.mark({class: "latexPro-inline-command"})})
                console.log(`command ${match[0]}`)
            }
            // braces
            while ((match = braceRegex.exec(text))!== null){
                const start = range.start + match.index;
                const end = start + 1;
                decorations.push({start: start, end: end, mark: Decoration.mark({class: "latexPro-inline-brace"})})
                console.log(`braces ${match[0]}`)
            }
            // start tag
            if (startTagRegex){
                console.log(range.start, range.start + startTagRegex[0].length)
                decorations.push({start: range.start, end: range.start + startTagRegex[0].length, mark: Decoration.mark({class: "latexPro-inline-tag-marker"})})
            }
            // end tag
            if (endTagRegex){
                decorations.push({start: range.end - endTagRegex[0].length,end: range.end, mark: Decoration.mark({class: "latexPro-inline-tag-marker"})})
            }
            // whole tag
            decorations.push({start: range.start, end: range.end, mark:  Decoration.mark({class:"latexPro-inline-tag-decoration"})})

           
        }

        decorations.sort((a,b)=> {
            const diff = a.start - b.end;
            if (diff !== 0) return diff;
            return a.start - b.end;
        })
        console.log(decorations)

        for (const d of decorations){
            builder.add(d.start, d.end, d.mark)
        }
        
        const decoSet = builder.finish();

        const field = StateField.define<DecorationSet>({
            create(){return decoSet},
            update(deco, tr){return deco.map(tr.changes)},
            provide: f => EditorView.decorations.from(f)
        })

        view.dispatch({effects: StateEffect.appendConfig.of([field])})
    }

class latexProInlinePlaceholder extends WidgetType{
    toDOM() {
        const span = document.createElement("span");
        span.className ="latexPro-inline-placeholder";

        span.style.display = "inline-block" // this ensures width of text is taken
        span.style.position = "relative"; // allow positioning over text
        span.style.backgroundColor = "rgba(0,0,0,0.08)";
        span.style.pointerEvents = "none";
        span.style.padding = "0 2px" // small padding around tag
        span.style.borderRadius = "3px"

        span.textContent = "⏳";
        // span.textContent = "test";

        return span;
    }
    ignoreEvent(){
        // makes it so the span ignores any mouseclicks etc
        return true;
    }
}

export function createInlinePlaceholder(
    view: EditorView,
    tags: {start: number, end: number}[]
    ){
        const builder = new RangeSetBuilder<Decoration>();

        // performance wise the body of for loop is not costly
        for (const tag of tags){
            const widget = Decoration.widget({
                widget: new latexProInlinePlaceholder(),
                side : 1 // means the insertion is after the symbol specified in builder.add
            })
            // puts widget at end of dollar symbol
            builder.add(tag.end,tag.end,widget)
        }
        return builder.finish();
    }

export async function getInlineLatexTagsInEditor(markdown: string){
    // will store tag content and positions in document at each entry
    const tags: {start: number; end: number; content: string}[]=[]

    const inlineTagRegex = /\$latexPro:([\s\S]+?)\$/g

    let match: RegExpExecArray | null; 

    while ((match=inlineTagRegex.exec(markdown))!== null){
        const start = match.index;
        const end = match.index + match[0].length
        const content = match[1].trim();

        tags.push({start, end, content})
    }

    return tags
}

// makes output of tags tidy for console logging
export function formatLatexTagsForPrint(
  tags: { start: number; end: number; content: string }[]
): string {
  return tags
    .map(tag => `start ${tag.start} end ${tag.end} content ${tag.content}`)
    .join("\n");
}

// grabs the markdown content of active file, returns as string.
export async function grabActiveFileContent(app: App){
    const file = app.workspace.getActiveFile();
    if (!file){
        return null;
    }
    const content = await app.vault.read(file);
    return content
}

