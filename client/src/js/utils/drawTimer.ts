import Timer from "./timer";
function initializeTimer( end: number): Timer {
   return new Timer(new Date(end ?? Date.now()), document.querySelector("#timer"))
}

export default initializeTimer