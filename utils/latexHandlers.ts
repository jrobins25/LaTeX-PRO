/*
latexHandlers.ts
    makes helper functions that compiles tex, makes png and displays the png
*/
import { exec, spawn } from "child_process";
import * as fs from "fs/promises";

// makes latex file with latexCode at tempFilePath
export async function makeTexFile(
        filePath: string,
        latexCode: string
    ){
        try {
            fs.writeFile(filePath,latexCode)
            return "Made LaTeX file"
        } catch (err){
            throw new Error(`Couldn\'t make LaTeX file\n ${err}`)
        }
    }

// compiles pdf, puts pdf in temporary folder
export async function compileTexToPdf(
    latexExePath : string,
    texFolderPath : string,
    texFileName : string,
    durationUntilTimeout : number
    ): Promise<string>{
        return new Promise((compiled,notCompiled) =>{
            const child = spawn(
                latexExePath,
                ["-interaction=nonstopmode","-halt-on-error", texFileName], 
                { timeout : durationUntilTimeout, cwd : texFolderPath }
            )

            let stdout = "";
            let stderr = "";

            child.stdout.on("data",(chunk)=>{stdout += chunk})
            child.stderr.on("data",(chunk)=>{stderr += chunk})

            child.on("error", (err)=> notCompiled(err));
            child.on("exit", (code)=>{
                if (code === 0) {
                    compiled(stdout)
                }
                else{
                    console.error("Latex stdout: ",stdout)
                    console.error("Latex stderr: ",stderr)
                    notCompiled(new Error(`LaTeX compilation failed\n${stderr}`))}
            })
        })
}

export async function convertPdfToPng(
    magickExePath : string,
    dpi: string,
    fileName : string, // no suffix: is added in function
    pdfFolderPath : string,
    durationUntilTimeout : number
    ):Promise<string>{
        return new Promise((converted,notConverted)=>{
            const child =  spawn(
                magickExePath,
                ["-density", dpi,`${fileName}.pdf`, "-transparent", "white",`${fileName}.png`],
                {timeout: durationUntilTimeout, cwd : pdfFolderPath}
            )

            let stdout = "";
            let stderr = "";

            child.stdout.on("data",(chunk)=>{stdout += chunk})
            child.stderr.on("data",(chunk)=>{stderr += chunk})

            child.on("error", (err)=> notConverted(err));
            child.on("exit", (code)=>{
                if (code === 0) {
                    converted(stdout)
                }
                else{
                    // console.error("magick stdout: ",stdout)
                    // console.error("magick stderr: ",stderr)
                    notConverted(new Error(`magick png conversion failed\n${stderr}`))}
            })
        })
}

export async function displayPng(
    el : HTMLElement,
    pngPath : string // include suffix
    ){  
        try{
            const pngBufferData = await fs.readFile(pngPath)
            const base64Data = pngBufferData.toString("base64")
            const dataUrl = `data:image/png;base64,${base64Data}`

            el.innerHTML = `<img src="${dataUrl}" alt="PNG preview"/>`

        }catch (err){
            console.error("Failed to display PNG: ", err)
        }
        
        
    }

// const path = "C:\\texlive\\2025\\bin\\windows\\pdflatex.exe"
// const cmd= formatCompilationCmd(path,"PNGmaker")
// CompileTexToPdf(cmd,10000,"C:\\Users\\Robin\\Desktop\\Plugin\\PNGmaker") works