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

function genericAJAXRequest(method, url, data){
    let promise = new Promise((resolve, reject) => {
        let jqXHR = $[method](url, data);

        jqXHR.done(resData => {
            resolve({ jqXHR, resData })
        });
        jqXHR.fail(() => {
            reject({ jqXHR });
        });
    });
    
    return promise;
}

async function get(url, data){
    let result =  await genericAJAXRequest('get', url, data);
    return result;
}

async function post(url, data){   
    let result = await genericAJAXRequest('post', url, data);
    return result;
}

export { get, post }
