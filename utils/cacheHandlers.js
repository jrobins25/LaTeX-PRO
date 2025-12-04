import { __awaiter } from "tslib";
/*
cacheHandlers.ts
    any helper function associated to managing cache, temporary folders or displaying from cache
*/
import * as fs from 'fs/promises';
import { makeCacheFilePath, makeCacheFolderPath, makeTempDirPrefixPath } from './formatters';
export function createTempDir() {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = makeTempDirPrefixPath(`latexPro`);
        try {
            const dirPath = yield fs.mkdtemp(prefix);
            return dirPath;
        }
        catch (err) {
            console.error('Failed to create temp directory:', err);
            throw err;
        }
    });
}
export function closeTempDir(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // recursively close folder, force ignores exceptions if folder does not exist
        fs.rm(dirPath, { recursive: true, force: true });
    });
}
export function moveFileToFolder(currentFilePath, // no suffix added in function
targetFilePath // no suffix added in function
) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.rename(currentFilePath, targetFilePath);
    });
}
// deletes all .png files in the cache folder
export function clearCache(cacheFolderName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheFolderPath = makeCacheFolderPath(cacheFolderName);
        let files = yield fs.readdir(cacheFolderPath);
        // if only png files do sth like
        // let files = files.filter(file => file.toLowerCase().endsWith(".png"))
        yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const fullPath = makeCacheFilePath(cacheFolderName, file);
            try {
                yield fs.unlink(fullPath);
            }
            catch (err) {
                // only ignore "file not found" errors
                if (err.code !== "ENOENT")
                    throw err;
            }
        })));
    });
}
// makes cache file in obsidian and reads the files
export function loadCache(cacheFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheFolderPath = makeCacheFolderPath(cacheFolder);
        // recursive means function is idempotent
        fs.mkdir(cacheFolderPath, { recursive: true });
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVIYW5kbGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhY2hlSGFuZGxlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7RUFHRTtBQUNGLE9BQU8sS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUc3RixNQUFNLFVBQWdCLGFBQWE7O1FBQy9CLE1BQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELElBQUc7WUFDQyxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDeEMsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFBQyxPQUFPLEdBQUcsRUFBQztZQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDdEQsTUFBTSxHQUFHLENBQUM7U0FDYjtJQUVMLENBQUM7Q0FBQTtBQUVELE1BQU0sVUFBZ0IsWUFBWSxDQUM5QixPQUFnQjs7UUFFWiw4RUFBOEU7UUFDOUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUcsSUFBSSxFQUFFLEtBQUssRUFBRyxJQUFJLEVBQUMsQ0FBQyxDQUFBO0lBQ3JELENBQUM7Q0FBQTtBQUVMLE1BQU0sVUFBZ0IsZ0JBQWdCLENBQ2xDLGVBQXVCLEVBQUUsOEJBQThCO0FBQ3ZELGNBQXVCLENBQUUsOEJBQThCOzs7UUFFbkQsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBQyxjQUFjLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0NBQUE7QUFFTCw2Q0FBNkM7QUFDN0MsTUFBTSxVQUFnQixVQUFVLENBQzVCLGVBQXdCOztRQUVwQixNQUFNLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUM1RCxJQUFJLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUMsZ0NBQWdDO1FBQ2hDLHdFQUF3RTtRQUV4RSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFPLElBQUksRUFBQyxFQUFFO1lBQ3BCLE1BQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDLGVBQWUsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUN6RCxJQUFHO2dCQUNDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTthQUM1QjtZQUFDLE9BQU8sR0FBRyxFQUFDO2dCQUNULHNDQUFzQztnQkFDdEMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7b0JBQUUsTUFBTSxHQUFHLENBQUE7YUFDdkM7UUFDTCxDQUFDLENBQUEsQ0FBQyxDQUNMLENBQUE7SUFDTCxDQUFDO0NBQUE7QUFFTCxtREFBbUQ7QUFDbkQsTUFBTSxVQUFnQixTQUFTLENBQ3ZCLFdBQW9COztRQUVwQixNQUFNLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4RCx5Q0FBeUM7UUFDekMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxTQUFTLEVBQUcsSUFBSSxFQUFDLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0NBQUE7QUFFTCxxREFBcUQ7QUFFckQ7Ozs7Ozs7Ozs7Ozs7OztFQWVFIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuY2FjaGVIYW5kbGVycy50c1xyXG4gICAgYW55IGhlbHBlciBmdW5jdGlvbiBhc3NvY2lhdGVkIHRvIG1hbmFnaW5nIGNhY2hlLCB0ZW1wb3JhcnkgZm9sZGVycyBvciBkaXNwbGF5aW5nIGZyb20gY2FjaGVcclxuKi9cclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgeyBtYWtlQ2FjaGVGaWxlUGF0aCwgbWFrZUNhY2hlRm9sZGVyUGF0aCwgbWFrZVRlbXBEaXJQcmVmaXhQYXRoIH0gZnJvbSAnLi9mb3JtYXR0ZXJzJztcclxuXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVtcERpcigpe1xyXG4gICAgY29uc3QgcHJlZml4ID0gbWFrZVRlbXBEaXJQcmVmaXhQYXRoKGBsYXRleFByb2ApO1xyXG4gICAgdHJ5e1xyXG4gICAgICAgIGNvbnN0IGRpclBhdGggPSBhd2FpdCBmcy5ta2R0ZW1wKHByZWZpeClcclxuICAgICAgICByZXR1cm4gZGlyUGF0aDtcclxuICAgIH0gY2F0Y2ggKGVycil7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSB0ZW1wIGRpcmVjdG9yeTonLCBlcnIpXHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsb3NlVGVtcERpcihcclxuICAgIGRpclBhdGggOiBzdHJpbmdcclxuICAgICl7XHJcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2xvc2UgZm9sZGVyLCBmb3JjZSBpZ25vcmVzIGV4Y2VwdGlvbnMgaWYgZm9sZGVyIGRvZXMgbm90IGV4aXN0XHJcbiAgICAgICAgZnMucm0oZGlyUGF0aCwgeyByZWN1cnNpdmUgOiB0cnVlLCBmb3JjZSA6IHRydWV9KVxyXG4gICAgfVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1vdmVGaWxlVG9Gb2xkZXIoXHJcbiAgICBjdXJyZW50RmlsZVBhdGg6IHN0cmluZywgLy8gbm8gc3VmZml4IGFkZGVkIGluIGZ1bmN0aW9uXHJcbiAgICB0YXJnZXRGaWxlUGF0aCA6IHN0cmluZyAgLy8gbm8gc3VmZml4IGFkZGVkIGluIGZ1bmN0aW9uXHJcbiAgICApe1xyXG4gICAgICAgIHJldHVybiBmcy5yZW5hbWUoY3VycmVudEZpbGVQYXRoLHRhcmdldEZpbGVQYXRoKVxyXG4gICAgfVxyXG5cclxuLy8gZGVsZXRlcyBhbGwgLnBuZyBmaWxlcyBpbiB0aGUgY2FjaGUgZm9sZGVyXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckNhY2hlKFxyXG4gICAgY2FjaGVGb2xkZXJOYW1lIDogc3RyaW5nXHJcbiAgICApe1xyXG4gICAgICAgIGNvbnN0IGNhY2hlRm9sZGVyUGF0aCA9IG1ha2VDYWNoZUZvbGRlclBhdGgoY2FjaGVGb2xkZXJOYW1lKVxyXG4gICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IGZzLnJlYWRkaXIoY2FjaGVGb2xkZXJQYXRoKTtcclxuICAgICAgICAvLyBpZiBvbmx5IHBuZyBmaWxlcyBkbyBzdGggbGlrZVxyXG4gICAgICAgIC8vIGxldCBmaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi5wbmdcIikpXHJcblxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICBmaWxlcy5tYXAoYXN5bmMgKGZpbGUpPT57XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IG1ha2VDYWNoZUZpbGVQYXRoKGNhY2hlRm9sZGVyTmFtZSxmaWxlKTtcclxuICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmcy51bmxpbmsoZnVsbFBhdGgpXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaWdub3JlIFwiZmlsZSBub3QgZm91bmRcIiBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgIT09IFwiRU5PRU5UXCIpIHRocm93IGVyclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbi8vIG1ha2VzIGNhY2hlIGZpbGUgaW4gb2JzaWRpYW4gYW5kIHJlYWRzIHRoZSBmaWxlc1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZENhY2hlKFxyXG4gICAgICAgIGNhY2hlRm9sZGVyIDogc3RyaW5nXHJcbiAgICApe1xyXG4gICAgICAgIGNvbnN0IGNhY2hlRm9sZGVyUGF0aCA9IG1ha2VDYWNoZUZvbGRlclBhdGgoY2FjaGVGb2xkZXIpXHJcbiAgICAgICAgLy8gcmVjdXJzaXZlIG1lYW5zIGZ1bmN0aW9uIGlzIGlkZW1wb3RlbnRcclxuICAgICAgICBmcy5ta2RpcihjYWNoZUZvbGRlclBhdGgsIHsgcmVjdXJzaXZlIDogdHJ1ZX0pXHJcbiAgICB9XHJcblxyXG4vLyBkZWZpbmVzIGNhY2hlRm9sZGVyUGF0aCwgbWFrZXMgZm9sZGVyIGlmIG5vdCB0aGVyZVxyXG5cclxuLypcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQ2FjaGUoKXtcclxuICAgIGlmICh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpIHtcclxuICAgICAgICB0aGlzLmNhY2hlRm9sZGVyUGF0aCA9IHBhdGguam9pbihcclxuICAgICAgICAgICAgLy8gdGhlIGFic29sdXRlIHBhdGggdG8gb2JzaWRpYW4gZm9sZGVyXHJcbiAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKSxcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jYWNoZUZvbGRlclxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5jYWNoZUZvbGRlclBhdGgpKXtcclxuICAgICAgICBmcy5ta2RpclN5bmModGhpcy5jYWNoZUZvbGRlclBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4qLyJdfQ==