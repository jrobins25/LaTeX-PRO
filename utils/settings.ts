import {PluginSettingTab, App, Setting, Notice} from "obsidian";
import latexPro from "../main";
import * as path from "path";
import { clearCache } from "./cacheHandlers";

export class latexProSettingsTab extends PluginSettingTab {
	plugin: latexPro;

	constructor(app: App, plugin: latexPro) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Inline LaTeX")
			.setDesc("Do you want the inline LaTeX rendering on or off?")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.inlineRendering)
				.onChange(async (value) => {
					this.plugin.settings.inlineRendering = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Documentclass')
			.setDesc('Set the documentclass and specs')
			.setClass('settings_textfield')
			.addText(text => text
				.setPlaceholder('\\documentclass{standalone}')
				.setValue(this.plugin.settings.documentClass)
                .onChange(async (value) => {
					this.plugin.settings.documentClass = value;
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)
			.setName('Preamble')
			.setDesc('Add your preamble without documentclass specification')
			.setClass('preamble_textArea')
			.addTextArea(text => text
				.setPlaceholder('Preamble here')
				.setValue(this.plugin.settings.preamble)
				.onChange(async (value) => {
					this.plugin.settings.preamble = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('pdflatex.exe path')
			.setDesc('Absolute path to pdflatex executable. Make sure it\'s pdflatex and not latex, the latter doesn\'t output pdf.')
			.setClass('settings_textfield')
			.addText(text => text
				.setPlaceholder('where.exe pdflatex')
				.setValue(this.plugin.settings.latexExePath)
				.onChange(async (value) => {
					this.plugin.settings.latexExePath = path.normalize(value);
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)
			.setName('magick path')
			.setDesc('Absolute path to magick (pdf->png converter)')
			.setClass('settings_textfield')
			.addText(text => text
				.setPlaceholder('where.exe magick')
				.setValue(this.plugin.settings.magickExePath)
				.onChange(async (value) => {
					this.plugin.settings.magickExePath = path.normalize(value);
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)
			.setName('Cache folder path')
			.setDesc('PNGs rendered by this plugin will be kept in this folder, if set. The plugin will automatically keep track of used svgs and remove any that aren\'t being used.')
			.setClass('settings_textfield')
			.addText(text => text
				.setPlaceholder('path')
				.setValue(this.plugin.settings.cacheFolderName)
                .onChange(async (value) => {
					this.plugin.settings.cacheFolderName = value;
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)  
			.setName('PNG Quality')
			.setDesc('Set the DPI value for the PNGs. A lower value means lower quality, a higher value means higher quality but potentially large file sizes and slowdown')  
			.addDropdown((dropdown) =>  
			dropdown  
				.addOption("300", '300 dpi')  
				.addOption("600", '600 dpi')  
				.addOption("1200", '1200 dpi')
				.addOption("2400", '2400 dpi')  
				.setValue(this.plugin.settings.png_dpi)  
				.onChange(async (value) => {  
					this.plugin.settings.png_dpi = value;  
					await this.plugin.saveSettings();  
				})  
			)
		new Setting(containerEl)  
			.setName('Clear Cache')  
			.setDesc('Pressing this buttons clears all png files')  
			.addButton(button => button  
			.setButtonText('Clear')  
			.onClick(() => {
				clearCache(this.plugin.settings.cacheFolderName)  
				new Notice('Cache is cleared');  
			})  
			)
	}
}
