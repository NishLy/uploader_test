import { DATA_INTERFACE } from "../interfaces/data";


class listData {
    private data: DATA_INTERFACE[];

    constructor(data: DATA_INTERFACE[]) {
        this.data = data
    }

    /**
     * It removes all the items from the data array.
     */
    removeAll() {
        this.data = [];
    }

    /**
     * The function takes a string as an argument, and returns a new array with the object that has the
     * same key as the argument removed.
     * @param {string} key - string
     */
    remove(key: string) {
        this.data = this.data.filter((data) => data.nim !== key)
    }

    /**
     * The function takes in a parameter of type DATA_INTERFACE and pushes it to the data array.
     * @param {DATA_INTERFACE} data - DATA_INTERFACE[] - This is the array of data that will be
     * displayed in the table.
     */
    append(data: DATA_INTERFACE) {
        this.data.push(data)
    }

    /**
     * It takes a key and a data object, finds the index of the data object in the data array that has
     * the same key as the key passed in, and if it finds it, it replaces the data object at that index
     * with the data object passed in
     * @param {string} key - string
     * @param {DATA_INTERFACE} data - DATA_INTERFACE
     */
    update(key: string, data: DATA_INTERFACE) {
        const index = this.data.findIndex((data) => data.nim !== key)
        if (index !== -1) this.data[index] = data
    }


    /**
     * It returns the first element of the array that matches the condition.
     * @param {string} key - string - The key of the data you want to get
     * @returns The data object that has the key that matches the key passed in.
     */
    get(key: string) {
        return this.data.find((data) => data.nim === key)
    }

    /**
     * GetAll() {
     *         return this.data
     *     }
     * @returns The data array.
     */

    getAll() {
        return this.data 
    }

    /**
     * It takes an array of objects and sets the data property of the class to that array.
     * @param {DATA_INTERFACE[]} data - DATA_INTERFACE[] - This is the data that will be stored in the
     * service.
     */
    setAll(data: DATA_INTERFACE[]) {
        this.data = data
    }

}

export default listData