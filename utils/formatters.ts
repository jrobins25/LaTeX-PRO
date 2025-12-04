/* formatters.ts 
    makes hashes, stitches together the .tex file contents and command prompts */
import { Md5 } from "ts-md5";
import { FileSystemAdapter } from "obsidian";
import * as path from "path";
import * as os from 'os';
// import latexProSettings from "../main"



// makes content for the .tex file
export function formatLatexCode(
    documentClass : string,
    preamble : string,
    latexUserCode : string,

    ){
		return(
            `
            ${documentClass}
            ${preamble}
            \\begin{document}
            \\begin{minipage}{525pt}
            ${latexUserCode}
            \\end{minipage}
            \\end{document}
            `
		)
	}

// for every latex code a unique id
export function makeFileName(
        latexUserCode : string
    ){
        // without trim the key would be different for .tex files differing by spacebars etc
        return Md5.hashStr(latexUserCode.trim())
    }

// exclude suffix
export function makeAbsoluteFilePath(
        folderPath : string,
        fileName : string
    ){
        return path.join(folderPath,fileName)
    }

export function getObsidianRoot(){
    if (this.app.vault.adapter instanceof FileSystemAdapter){
        const obsidianRoot = this.app.vault.adapter.getBasePath()
        return obsidianRoot
    }
    else{
        console.error("Tried to find obsidian root outside of desktop")
        throw new Error("This feature is only supported on desktop")
    }
}

export function makeCacheFolderPath(
    cacheFolderName : string
    ){
        return path.join(getObsidianRoot(),cacheFolderName)
    }

export function makeCacheFilePath(
    cacheFolderName : string,
    fileName : string // include suffix in argument
    ){
        return path.join(makeCacheFolderPath(cacheFolderName),fileName)
    }

// command that compiles latex in texFileName.tex file to make pdf
export function formatCompilationCmd(
    PathToLatexExe : string,
    filePath : string,
    ){
        return(`${PathToLatexExe} -interaction=nonstopmode -halt-on-error ${filePath}.tex`)
    }

export function formatConversionCmd(
    pathToMagick : string,
    dpi_setting : string,
    filePath : string
    ){ return(`${pathToMagick} -density ${dpi_setting} ${filePath}.pdf -transparent white ${filePath}.png`)}

export function makeTempDirPrefixPath(
    name : string
    ){ return path.join(os.tmpdir(),name) }


// const result = formatLatexCode("\\documentclass{standalone}","\\usepackage{amsmath}","$x^2$ is a cool function")
// const result = formatCompilationCmd("\\userIsGoon","goon")

// console.log(result)