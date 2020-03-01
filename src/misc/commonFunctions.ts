import * as fs from 'fs';
export  function saveToJsonFile(filePath: string, payload: string): void {
    fs.writeFile(filePath, JSON.stringify(payload), () => {console.log('File saved Successfully!')});
}
