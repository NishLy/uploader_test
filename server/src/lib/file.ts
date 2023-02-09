import fs from "fs"

/**
 * This function creates a directory if it doesn't exist, and returns a promise that resolves to true
 * if the directory was created or already exists, or false if the directory couldn't be created.
 * @param {string} path - The path to the directory you want to create.
 * @returns A promise that resolves to a boolean.
 */
export const createDirectoryAsync = (path: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        if (fs.existsSync(path)) return resolve(true)
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) return reject(err);
            resolve(true)
        })
    })
}

/**
 * It returns a promise that resolves to the data read from the file at the given path
 * @param {string} path - The path to the file you want to read.
 * @returns A promise that resolves to the data read from the file.
 */
export const readFileAsync = (path: string) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(path, (err, data) => {
            if (err) return rejects(err)
            return resolve(data)
        })
    })
}

/**
 * It takes a path and data as arguments and returns a promise that resolves to true if the file was
 * written successfully or rejects with an error if it wasn't
 * @param {string} path - string - The path to the file you want to write to.
 * @param {any} data - any - This is the data that you want to write to the file.
 * @returns A promise that resolves to a boolean or rejects with an error.
 */
export const writeFileAsync = (path: string, data: any): Promise<string | boolean> => {
    return new Promise((resolve, rejects) => {
        fs.writeFile(path, data, (err: any) => {
            if (!err) resolve(true)
            rejects(err)
        })
    })

}

/**
 * It takes a path and data as arguments and returns a promise that resolves to true if the file was
 * appended successfully or rejects with an error if it wasn't
 * @param {string} path - The path to the file you want to append to.
 * @param {any} data - The data to write. If something other than a Buffer or Uint8Array is provided,
 * the value is coerced to a string.
 * @returns A promise that resolves to a string or boolean.
 */
export const appendFileAsync = (path: string, data: any): Promise<string | boolean> => {
    return new Promise((resolve, rejects) => {
        fs.appendFile(path, data, (err: any) => {
            if (!err) resolve(true)
            rejects(err)
        })
    })

}


/**
 * It returns a promise that resolves to an array of file names in a given directory, or rejects with
 * an error
 * @param {string} path - string - The path to the directory you want to read
 * @returns A promise that resolves to an array of strings or null.
 */
export const readFilesNameAsync = (path: string): Promise<string[] | null> => {
    return new Promise((resolve, rejects) => {
        if (!fs.existsSync(path)) return rejects(null)
        fs.readdir(path, (err, files) => {
            if (!err) resolve(files)
            rejects(err)
        })
    });
}

/**
 * It copies a file from one location to another
 * @param {string} src - The source file path
 * @param {string} dest - The destination path of the file to be copied.
 * @returns A promise that resolves to a boolean.
 */
export const copyFileAsync = (src: string, dest: string): Promise<boolean> => {
    return new Promise((resolve, rejects) => {
        if (!fs.existsSync(src)) return rejects(null)
        fs.copyFile(src, dest, (err) => {
            if (!err) resolve(true)
            rejects(err)
        })
    })
}

/**
 * It deletes a file at the given path, and returns a promise that resolves to true if the file was
 * deleted, or rejects with an error if the file could not be deleted
 * @param {string} path - The path to the file you want to delete.
 * @returns A promise that resolves to a boolean.
 */
export const deleteFileAsync = (path: string): Promise<boolean> => {
    return new Promise((resolve, rejects) => {
        if (!fs.existsSync(path)) rejects(null)
        fs.unlink(path, (err) => {
            if (!err) resolve(true)
            rejects(err)
        })
    })
}