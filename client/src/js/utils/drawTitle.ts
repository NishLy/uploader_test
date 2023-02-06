
const drawTitle = (matkul: string = "", kelas: string = "") => {
    (document.querySelector('#matkul-title') as HTMLHeadingElement).innerText = matkul !== "" ? `UPLOADER - ${matkul} -  ${kelas}` : `UPLOADER`;
}

export default drawTitle