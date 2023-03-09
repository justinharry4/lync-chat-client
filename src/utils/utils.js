function trim(str){
    let lines = str.split('\n');
    let trimmedLines = [];

    for (let line of lines){
        let startIndex;
        for (let idx in line){
            if (line.charAt(idx) !== ' ' && !startIndex){
                startIndex = idx;
                break;
            }
        }

        let trimmedLine = line.slice(startIndex);
        trimmedLines.push(trimmedLine);
    }

    return trimmedLines.join('\n');
}
