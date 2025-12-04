import { __awaiter } from "tslib";
import { PluginSettingTab, Setting, Notice } from "obsidian";
import * as path from "path";
import { clearCache } from "./cacheHandlers";
export class latexProSettingsTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new Setting(containerEl)
            .setName("Inline LaTeX")
            .setDesc("Do you want the inline LaTeX rendering on or off?")
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.inlineRendering)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.inlineRendering = value;
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('Documentclass')
            .setDesc('Set the documentclass and specs')
            .setClass('settings_textfield')
            .addText(text => text
            .setPlaceholder('\\documentclass{standalone}')
            .setValue(this.plugin.settings.documentClass)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.documentClass = value;
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('Preamble')
            .setDesc('Add your preamble without documentclass specification')
            .setClass('preamble_textArea')
            .addTextArea(text => text
            .setPlaceholder('Preamble here')
            .setValue(this.plugin.settings.preamble)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.preamble = value;
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('pdflatex.exe path')
            .setDesc('Absolute path to pdflatex executable. Make sure it\'s pdflatex and not latex, the latter doesn\'t output pdf.')
            .setClass('settings_textfield')
            .addText(text => text
            .setPlaceholder('where.exe pdflatex')
            .setValue(this.plugin.settings.latexExePath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.latexExePath = path.normalize(value);
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('magick path')
            .setDesc('Absolute path to magick (pdf->png converter)')
            .setClass('settings_textfield')
            .addText(text => text
            .setPlaceholder('where.exe magick')
            .setValue(this.plugin.settings.magickExePath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.magickExePath = path.normalize(value);
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('Cache folder path')
            .setDesc('PNGs rendered by this plugin will be kept in this folder, if set. The plugin will automatically keep track of used svgs and remove any that aren\'t being used.')
            .setClass('settings_textfield')
            .addText(text => text
            .setPlaceholder('path')
            .setValue(this.plugin.settings.cacheFolder)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.cacheFolder = value;
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('PNG Quality')
            .setDesc('Set the DPI value for the PNGs. A lower value means lower quality, a higher value means higher quality but potentially large file sizes and slowdown')
            .addDropdown((dropdown) => dropdown
            .addOption("300", '300 dpi')
            .addOption("600", '600 dpi')
            .addOption("1200", '1200 dpi')
            .addOption("2400", '2400 dpi')
            .setValue(this.plugin.settings.png_dpi)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.png_dpi = value;
            yield this.plugin.saveSettings();
        })));
        new Setting(containerEl)
            .setName('Clear Cache')
            .setDesc('Pressing this buttons clears all png files')
            .addButton(button => button
            .setButtonText('Clear')
            .onClick(() => {
            clearCache(this.plugin.settings.cacheFolder);
            new Notice('Cache is cleared');
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLGdCQUFnQixFQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFaEUsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUFHeEQsWUFBWSxHQUFRLEVBQUUsTUFBZ0I7UUFDckMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRUQsT0FBTztRQUNOLE1BQU0sRUFBQyxXQUFXLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUN0QixPQUFPLENBQUMsY0FBYyxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQzthQUM1RCxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNO2FBQ3pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7YUFDOUMsUUFBUSxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM3QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBRU4sSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3RCLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDeEIsT0FBTyxDQUFDLGlDQUFp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QUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDNUMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FDRCxDQUFBO0lBQ0gsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQbHVnaW5TZXR0aW5nVGFiLCBBcHAsIFNldHRpbmcsIE5vdGljZX0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBsYXRleFBybyBmcm9tIFwiLi4vbWFpblwiO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNsZWFyQ2FjaGUgfSBmcm9tIFwiLi9jYWNoZUhhbmRsZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgbGF0ZXhQcm9TZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogbGF0ZXhQcm87XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IGxhdGV4UHJvKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZShcIklubGluZSBMYVRlWFwiKVxyXG5cdFx0XHQuc2V0RGVzYyhcIkRvIHlvdSB3YW50IHRoZSBpbmxpbmUgTGFUZVggcmVuZGVyaW5nIG9uIG9yIG9mZj9cIilcclxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlXHJcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmlubGluZVJlbmRlcmluZylcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbmxpbmVSZW5kZXJpbmcgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0RvY3VtZW50Y2xhc3MnKVxyXG5cdFx0XHQuc2V0RGVzYygnU2V0IHRoZSBkb2N1bWVudGNsYXNzIGFuZCBzcGVjcycpXHJcblx0XHRcdC5zZXRDbGFzcygnc2V0dGluZ3NfdGV4dGZpZWxkJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdcXFxcZG9jdW1lbnRjbGFzc3tzdGFuZGFsb25lfScpXHJcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRvY3VtZW50Q2xhc3MpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5kb2N1bWVudENsYXNzID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHQpXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ByZWFtYmxlJylcclxuXHRcdFx0LnNldERlc2MoJ0FkZCB5b3VyIHByZWFtYmxlIHdpdGhvdXQgZG9jdW1lbnRjbGFzcyBzcGVjaWZpY2F0aW9uJylcclxuXHRcdFx0LnNldENsYXNzKCdwcmVhbWJsZV90ZXh0QXJlYScpXHJcblx0XHRcdC5hZGRUZXh0QXJlYSh0ZXh0ID0+IHRleHRcclxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJ1ByZWFtYmxlIGhlcmUnKVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcmVhbWJsZSlcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcmVhbWJsZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdwZGZsYXRleC5leGUgcGF0aCcpXHJcblx0XHRcdC5zZXREZXNjKCdBYnNvbHV0ZSBwYXRoIHRvIHBkZmxhdGV4IGV4ZWN1dGFibGUuIE1ha2Ugc3VyZSBpdFxcJ3MgcGRmbGF0ZXggYW5kIG5vdCBsYXRleCwgdGhlIGxhdHRlciBkb2VzblxcJ3Qgb3V0cHV0IHBkZi4nKVxyXG5cdFx0XHQuc2V0Q2xhc3MoJ3NldHRpbmdzX3RleHRmaWVsZCcpXHJcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignd2hlcmUuZXhlIHBkZmxhdGV4JylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubGF0ZXhFeGVQYXRoKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmxhdGV4RXhlUGF0aCA9IHBhdGgubm9ybWFsaXplKHZhbHVlKTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnbWFnaWNrIHBhdGgnKVxyXG5cdFx0XHQuc2V0RGVzYygnQWJzb2x1dGUgcGF0aCB0byBtYWdpY2sgKHBkZi0+cG5nIGNvbnZlcnRlciknKVxyXG5cdFx0XHQuc2V0Q2xhc3MoJ3NldHRpbmdzX3RleHRmaWVsZCcpXHJcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignd2hlcmUuZXhlIG1hZ2ljaycpXHJcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1hZ2lja0V4ZVBhdGgpXHJcblx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MubWFnaWNrRXhlUGF0aCA9IHBhdGgubm9ybWFsaXplKHZhbHVlKTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdClcclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQ2FjaGUgZm9sZGVyIHBhdGgnKVxyXG5cdFx0XHQuc2V0RGVzYygnUE5HcyByZW5kZXJlZCBieSB0aGlzIHBsdWdpbiB3aWxsIGJlIGtlcHQgaW4gdGhpcyBmb2xkZXIsIGlmIHNldC4gVGhlIHBsdWdpbiB3aWxsIGF1dG9tYXRpY2FsbHkga2VlcCB0cmFjayBvZiB1c2VkIHN2Z3MgYW5kIHJlbW92ZSBhbnkgdGhhdCBhcmVuXFwndCBiZWluZyB1c2VkLicpXHJcblx0XHRcdC5zZXRDbGFzcygnc2V0dGluZ3NfdGV4dGZpZWxkJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdwYXRoJylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FjaGVGb2xkZXIpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYWNoZUZvbGRlciA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KVxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpICBcclxuXHRcdFx0LnNldE5hbWUoJ1BORyBRdWFsaXR5JylcclxuXHRcdFx0LnNldERlc2MoJ1NldCB0aGUgRFBJIHZhbHVlIGZvciB0aGUgUE5Hcy4gQSBsb3dlciB2YWx1ZSBtZWFucyBsb3dlciBxdWFsaXR5LCBhIGhpZ2hlciB2YWx1ZSBtZWFucyBoaWdoZXIgcXVhbGl0eSBidXQgcG90ZW50aWFsbHkgbGFyZ2UgZmlsZSBzaXplcyBhbmQgc2xvd2Rvd24nKSAgXHJcblx0XHRcdC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+ICBcclxuXHRcdFx0ZHJvcGRvd24gIFxyXG5cdFx0XHRcdC5hZGRPcHRpb24oXCIzMDBcIiwgJzMwMCBkcGknKSAgXHJcblx0XHRcdFx0LmFkZE9wdGlvbihcIjYwMFwiLCAnNjAwIGRwaScpICBcclxuXHRcdFx0XHQuYWRkT3B0aW9uKFwiMTIwMFwiLCAnMTIwMCBkcGknKVxyXG5cdFx0XHRcdC5hZGRPcHRpb24oXCIyNDAwXCIsICcyNDAwIGRwaScpICBcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucG5nX2RwaSkgIFxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHsgIFxyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MucG5nX2RwaSA9IHZhbHVlOyAgXHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTsgIFxyXG5cdFx0XHRcdH0pICBcclxuXHRcdFx0KVxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpICBcclxuXHRcdFx0LnNldE5hbWUoJ0NsZWFyIENhY2hlJykgIFxyXG5cdFx0XHQuc2V0RGVzYygnUHJlc3NpbmcgdGhpcyBidXR0b25zIGNsZWFycyBhbGwgcG5nIGZpbGVzJykgIFxyXG5cdFx0XHQuYWRkQnV0dG9uKGJ1dHRvbiA9PiBidXR0b24gIFxyXG5cdFx0XHQuc2V0QnV0dG9uVGV4dCgnQ2xlYXInKSAgXHJcblx0XHRcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdFx0XHRjbGVhckNhY2hlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNhY2hlRm9sZGVyKSAgXHJcblx0XHRcdFx0bmV3IE5vdGljZSgnQ2FjaGUgaXMgY2xlYXJlZCcpOyAgXHJcblx0XHRcdH0pICBcclxuXHRcdFx0KVxyXG5cdH1cclxufVxyXG4iXX0=