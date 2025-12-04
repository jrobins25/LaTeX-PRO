/*
cacheHandlers.ts
    any helper function associated to managing cache, temporary folders or displaying from cache
*/
import * as fs from 'fs/promises';
import { makeCacheFilePath, makeCacheFolderPath, makeTempDirPrefixPath } from './formatters';


export async function createTempDir(){
    const prefix = makeTempDirPrefixPath(`latexPro`);
    try{
        const dirPath = await fs.mkdtemp(prefix)
        return dirPath;
    } catch (err){
        console.error('Failed to create temp directory:', err)
        throw err;
    }

}

export async function closeTempDir(
    dirPath : string
    ){
        // recursively close folder, force ignores exceptions if folder does not exist
        fs.rm(dirPath, { recursive : true, force : true})
    }

export async function moveFileToFolder(
    currentFilePath: string, // no suffix added in function
    targetFilePath : string  // no suffix added in function
    ){
        return fs.rename(currentFilePath,targetFilePath)
    }

// deletes all .png files in the cache folder
export async function clearCache(
    cacheFolderName : string
    ){
        const cacheFolderPath = makeCacheFolderPath(cacheFolderName)
        let files = await fs.readdir(cacheFolderPath);
        // if only png files do sth like
        // let files = files.filter(file => file.toLowerCase().endsWith(".png"))

        await Promise.all(
            files.map(async (file)=>{
                const fullPath = makeCacheFilePath(cacheFolderName,file);
                try{
                    await fs.unlink(fullPath)
                } catch (err){
                    // only ignore "file not found" errors
                    if (err.code !== "ENOENT") throw err
                }
            })
        )
    }

// makes cache file in obsidian and reads the files
export async function loadCache(
        cacheFolder : string
    ){
        const cacheFolderPath = makeCacheFolderPath(cacheFolder)
        // recursive means function is idempotent
        fs.mkdir(cacheFolderPath, { recursive : true})
    }

// defines cacheFolderPath, makes folder if not there

/*

export async function loadCache(){
    if (this.app.vault.adapter instanceof FileSystemAdapter) {
        this.cacheFolderPath = path.join(
            // the absolute path to obsidian folder
            this.app.vault.adapter.getBasePath(),
            this.settings.cacheFolder
        );
    }
    if (!fs.existsSync(this.cacheFolderPath)){
        fs.mkdirSync(this.cacheFolderPath);
    }
}

*/