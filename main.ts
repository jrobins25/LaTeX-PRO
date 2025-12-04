import { Editor, MarkdownView, Modal, Notice } from 'obsidian';
import { 
	App, 
	// Plugin related
	Plugin, 
	PluginSettingTab, 
	Setting, 
	// File Writing & Editing
	TFile,
	TFolder,
	FileSystemAdapter,
	MarkdownPostProcessorContext,
	SectionCache,
} from 'obsidian';
import * as fs from "fs";
import * as temp from "temp";
import * as path from "path";
import { exec } from "child_process";
import { Decoration, EditorView } from "@codemirror/view"

import { latexProSettingsTab } from 'utils/settings.js';

import { makeFileName, formatLatexCode, makeAbsoluteFilePath, formatCompilationCmd, formatConversionCmd, makeCacheFilePath } from 'utils/formatters.js'
import { compileTexToPdf, convertPdfToPng, displayPng, makeTexFile } from 'utils/latexHandlers.js';
import { closeTempDir, createTempDir, loadCache, moveFileToFolder } from 'utils/cacheHandlers';
import { createInlinePlaceholder, decorateInlineTags, displayInlinePlaceholder, formatLatexTagsForPrint, getInlineLatexTagsInEditor, grabActiveFileContent } from 'utils/mdPostProcessing';
import { debugPanel, handleAppendDebugPanel } from 'utils/debugPanel';

interface latexProSettings {
	inlineRendering : boolean;
	preamble: string;
	latexExePath: string;
	magickExePath : string;
	cacheFolderName: string;
	png_dpi: string;
	documentClass : string;
	// non-user definables
	timeout: number;
	internal_cache: Map<string, Set<string>>; 
}

const DEFAULT_SETTINGS: latexProSettings = {
	inlineRendering : true,
	documentClass: '\\documentclass{standalone}',
	preamble: "\\usepackage{amsmath}",
	latexExePath: "",
	magickExePath: "magick",
	cacheFolderName: "png-cacheDev",
	png_dpi: "600",
	timeout: 10000,
	internal_cache: new Map(), 
}
// need to escape the backslash \ with another \

export default class latexPro extends Plugin {
	settings: latexProSettings;
	cacheFolderPath: string;
	cache: Map<string, Set<string>>; // Key: md5 hash of latex source. Value: Set of file path names.
	panel : debugPanel;


	async onload() {
		this.addSettingTab(new latexProSettingsTab(this.app, this));
		await this.loadSettings();
		loadCache(this.settings.cacheFolderName)
		// watch for codeblocks named latexPro
		this.registerMarkdownCodeBlockProcessor("latexPro",(latexUserCode, el, ctx) => {
			this.inputLatexPNG(latexUserCode,el,ctx)
		})

		// watch for inline code $latexPro: ... $ 
		this.addCommand({
			id: 'latexpro-debug-panel',
			name: 'Show Debug Panel',
			callback: () => {
				if (!this.panel){ // doesn't craete a second new instance
					this.panel = new debugPanel(); 
					this.panel.appendContent("Ready to listen")
				}
				this.panel.open()
			}
			
		})
		this.addCommand({
			id: 'append-to-debug-panel-with-key',
      		name: 'Append or Update Debug Panel Entry',
      		callback: () => handleAppendDebugPanel(this) // pass plugin instance
		})
		this.addCommand({
			id: 'get-all-inline-latex',
			name: 'Scan for All Tags',
			callback: async () => {
				this.panel.clearContent()
				this.panel.appendContent('Scanning for tags...')
				const content = await grabActiveFileContent(this.app);
				if (!content){
					this.panel.appendContent('No active file open.')
					return
				}
				const tags = await getInlineLatexTagsInEditor(content);
				const formatted = formatLatexTagsForPrint(tags);
				this.panel.appendContent(formatted,"tagScan")
			}
		})

	this.registerEvent(
			this.app.workspace.on('file-open', async (file) =>{
				if (file) { // might be that new empty tab is opened or something equivalent
					this.renderInlineLatex(file)
				}
			})
		)
	}
	async renderInlineLatex(file: TFile){
		// only render when user wants it
		if (!this.settings.inlineRendering) return;
		const content = await grabActiveFileContent(this.app);
		if (!content){
			this.panel.appendContent('No active file open.')
			return
		}
		const tags = await getInlineLatexTagsInEditor(content);
		const formatted = formatLatexTagsForPrint(tags);
		try{this.panel.appendContent(formatted,"tagScan")}
		catch{console.error("Couldn't log in debug panel")}
		
		// open the editor view and access it via CodeMirror 6
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		// @ts-expect-error: CodeMirror 6 EditorView is not typed in Obsidian
		const editorView = view.editor.cm as EditorView;

		const rangeSet = createInlinePlaceholder(editorView, tags);
		decorateInlineTags(editorView,tags)
		displayInlinePlaceholder(editorView, rangeSet)


	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async inputLatexPNG(
		latexUserCode: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	){	
		const { documentClass, preamble, cacheFolderName, latexExePath, png_dpi, timeout } = this.settings

		// TODO: reduce variables to only be a setting or function input
		const fileName = makeFileName(latexUserCode) // returns w/o suffix
		const cacheFilePath = makeCacheFilePath(cacheFolderName,fileName) // returns w/o suffix
		
		try{

			await loadCache(cacheFolderName)
			const tempFolderPath = await createTempDir() 
			const tempFilePath = makeAbsoluteFilePath(tempFolderPath,fileName) // w/o suffixes
			const latexCode = formatLatexCode(documentClass,preamble,latexUserCode)

			await makeTexFile(`${tempFilePath}.tex`, latexCode);
			await compileTexToPdf(latexExePath,tempFolderPath,fileName,timeout)
			await convertPdfToPng(`magick`,png_dpi,fileName,tempFolderPath,timeout)
			await moveFileToFolder(`${tempFilePath}.png`,`${cacheFilePath}.png`)
			await closeTempDir(tempFolderPath)

			displayPng(el,`${cacheFilePath}.png`)
		} catch (err){
			console.error(err)
		}
	}
}