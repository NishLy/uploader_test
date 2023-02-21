import Timer from "./timer";
/**
 * `initializeTimer` takes a number and returns a `Timer` object
 * @param {number} end - number - The end time of the timer.
 * @returns A Timer object.
 */
function initializeTimer( end: number): Timer {
   return new Timer(new Date(end ?? Date.now()), document.querySelector("#timer")!)
}

export default initializeTimer