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

// http request utilities
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

async function getCurrentChatId(app, pcId){
    let currentChatURL = `/chat/privatechats/${pcId}/chats/current/`;

    let chatResponse = await app.axios.get(currentChatURL);
    let currentChat = chatResponse.data;
    let chatId = currentChat.id;

    return chatId;
}

// generic utilities
function zeroSingleDigitNumber(number){
    return (number < 10) ? ('0' + number): number;
}

function singularOrPlural(num, sing, plural){
    return (num > 1 || num == 0) ? plural: sing;
}

// datetime utilities
function isValidDate(date){
    if (isNaN(date.valueOf())){
        return false
    }

    return true
}

function toHourMinuteFormat(datetimeStr, strict){
    let newDate = new Date(datetimeStr);

    if (!isValidDate(newDate)){
        return '';
    }

    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    
    // let formatNumber = (num) => (num < 10) ? ('0' + num): num;
    let formatedHours = zeroSingleDigitNumber(hours);
    let formatedMins = zeroSingleDigitNumber(minutes);

    let timeStr = formatedHours + ':' + formatedMins;
    return timeStr;
}

function toSlashedDayMonthYearFormat(datetimeStr){
    let date = new Date(datetimeStr);

    if (!isValidDate(date)){
        return '';
    }

    let day = zeroSingleDigitNumber(date.getDate());
    let month = zeroSingleDigitNumber(date.getMonth() + 1);
    let year = date.getFullYear();

    return day + '/' + month + '/' + year;
}

const time = {};

time.MILLISECOND = 1;
time.SECOND = time.MILLISECOND * 1000;
time.MINUTE = time.SECOND * 60;
time.HOUR = time.MINUTE * 60;
time.DAY = time.HOUR * 24;
time.WEEK = time.DAY * 7;
time.MONTH = time.DAY * 30;
time.YEAR = time.DAY * 365;

const dayMap = new Map([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday']
]);

const monthMap = new Map([
    [0, 'January'],
    [1, 'February'],
    [2, 'March'],
    [3, 'April'],
    [4, 'May'],
    [5, 'June'],
    [5, 'July'],
    [7, 'August'],
    [8, 'September'],
    [9, 'October'],
    [10, 'November'],
    [11, 'December']
]);


class FormattedDate {
    constructor(date){
        let originalDate = (date) ? new Date(date): new Date();
        let currentDate = new Date();

        if (isNaN(originalDate.valueOf())){
            throw new Error('Invalid date passed');
        }

        this.originalDate = originalDate;
        this.currentDate = currentDate;

        this.value = originalDate.valueOf();
        this.day = originalDate.getDay();
        this.date = originalDate.getDate();
        this.month = originalDate.getMonth();
        this.year = originalDate.getFullYear();
        this.dayName = dayMap.get(this.day);
        this.monthName = monthMap.get(this.month);
    }

    get altDayName(){
        let today = 'Today';
        let yesterday = 'Yesterday';
        let future = 'Future Date';
        let currentDate = this.currentDate;

        let msDiff = currentDate.valueOf() - this.value;
        let hoursDiff = Math.round(msDiff / time.HOUR);
        let daysDiff = Math.round(msDiff / time.DAY);

        if (msDiff < 0){
            return future;
        } else if (
            currentDate.getFullYear() == this.year &&
            currentDate.getMonth() == this.month &&
            currentDate.getDate() == this.date
        ){
            return today;
        } else {
            if (hoursDiff <= 24){
                return yesterday;
            } else {
                let s = (daysDiff > 1) ? 's': '';
                return daysDiff + ' day' + s + ' ago';
            }
        }
    }

    // get daysAgo(){}
    // get monthsAgo(){}
    // get yearsAgo(){}
}

// API specifications
const MSG_FORMATS = {
    TEXT: 'TXT',
    IMAGE: 'IMG',
    AUDIO: 'AUD',
    VIDEO: 'VID',
}

const DELIVERY_STATUSES = {
    IN_PROGRESS: 'P',
    SENT: 'S',
    DELIVERED: 'D',
    VIEWED: 'V',
}

export { 
    get,
    post,
    getCurrentChatId,
    FormattedDate,
    toHourMinuteFormat,
    toSlashedDayMonthYearFormat,
    MSG_FORMATS,
    DELIVERY_STATUSES,
    singularOrPlural,
};