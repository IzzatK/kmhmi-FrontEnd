export const getFormattedTime = (isoDateTime: string) => {
    let result = "";

    if (isoDateTime) {
        let date = new Date(isoDateTime);

        // result = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        result = isoDateTime.replace('T', ' - ');

        result = result.split('+')[0];
    }

    return result;
};

export const convertTimeStamp = (timeStamp: string | number | Date) => {
    let dateString = '';
    if(timeStamp) {
        const date = new Date(timeStamp);

        let minutes = date.getMinutes();
        // minutes.toLocaleString('en-US',
        // {
        //     style: 'decimal',
        //     minimumIntegerDigits: 2,
        //     useGrouping: false
        // });

        let hours = date.getHours();
        // hours.toLocaleString('en-US',
        // {
        //     style: 'decimal',
        //     minimumIntegerDigits: 2,
        //     useGrouping: false
        // });

        let hoursStr: string = '';
        if (hours < 10) {
            hoursStr = "0" + hours;
        }
        let minutesStr: string = '';
        if (minutes < 10) {
            minutesStr = "0" + minutes;
        }

        dateString = date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear() + ' ' + hoursStr + ':' + minutesStr
    }
    return dateString;
    // timestamp:"4/1/2020 2330",
};

export function getDateWithoutTime(dateTime: Date) {

    let year = dateTime.getUTCFullYear();

    let month = dateTime.getUTCMonth() + 1;
    let monthStr = month < 10 ? `0${month}` : month;

    let day = dateTime.getUTCDay();
    let dayStr = day < 10 ? `0${day}` : day;

    const date = year+'-'+monthStr+'-'+ dayStr;

    return date;
}
