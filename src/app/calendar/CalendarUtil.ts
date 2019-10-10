import { LOCALE_ID, Inject } from '@angular/core';

export class CalendarUtil {

    // Default date format
    static DATE_FORMAT = "MM/DD/YYYY"

    constructor(@Inject(LOCALE_ID) public locale: string) {

    }

    // Storing processed data to be reused 
    static processedData: Object = {};


    /**
     * Function to get the first day of the week for any given date
     * @param date The day from which to deterimne the first day of the week
     * @param setHoursToZero Set to true if the date hours should be set to 0
     */
    static getFirstDayOfWeekByDate(date: Date, setHoursToZero: boolean = true): Date {
        var currentDay = date.getDay(); //Sunday = 1, Monday =2, Tuesday = 3 etc..
        if (setHoursToZero === true) {

            // Setting hours to zero
            date.setHours(0, 0, 0, 0);
        }
        date.setDate(date.getDate() - currentDay); //Setting day back to Monday;

        // Returning the first day of the week
        return date;
    }


    /**
     * Generates an array that stores the days of the week for a given date
     * @param startDate The start date for the week
     */
    static getDatesInWeek(startDate: Date) {
        var week = [startDate];
        for (var i = 1; i < 7; i++) {
            var tempDate = new Date(startDate);
            tempDate.setDate(startDate.getDate() + i)
            week.push(tempDate);
        }
        return week;
    }

    /**
     * 
     * @param date 
     * @param numOfDaysAway 
     */
    static getDateFromBaseDate(date: Date, numOfDaysAway) {
        date.setDate(date.getDate() + numOfDaysAway);
        return new Date(date);

    }
    static getNextDate(date: Date) {
        date.setDate(date.getDate() + 1);
        return date;
    }

    static getPreviousDate(date: Date) {
        date.setDate(date.getDate() - 1);
        return date;
    }
    /*
        Function to get a set of weeks given a startDate and a endDate
        
    */

    static getDistanceBetweenTwoDates(startDate: Date, endDate: Date) {
        var difference = endDate.getTime() - startDate.getTime();
        return CalendarUtil.convertMilisecondsToDays(difference);
    }

    static convertMilisecondsToDays(ms: number) {
        var secs = Math.floor(ms / 1000);
        var mins = Math.floor(secs / 60);
        var hrs = Math.floor(mins / 60);
        var days = Math.floor(hrs / 24);
        return days;
    }

    static getMonthFromStartDate(date: Date, includeWeekends: boolean) {
        var firstDay = new Date(date);
        firstDay.setDate(1);

        var lastDay = new Date(date);
        var month = (firstDay.getMonth() === 11) ? 0 : lastDay.getMonth() + 1;
        lastDay.setMonth(month);
        lastDay.setDate(1);
        lastDay = CalendarUtil.getPreviousDate(lastDay);


        return CalendarUtil.getWeeksInRange(firstDay, lastDay, includeWeekends);



    }

    static getWeeksInRange(startDate: Date, endDate: Date, includeWeekends: boolean) {
        let functionName = "getWeeksInRange";
        var weeks = [];
        startDate = CalendarUtil.getFirstDayOfWeekByDate(startDate);

        if (CalendarUtil.processedData[functionName] === null || CalendarUtil.processedData[functionName] === undefined) {
            CalendarUtil.processedData[functionName] = {};
        }

        do {
            var week;
            var formattedDate = CalendarUtil.getDateString(startDate);

            var storedWeek = CalendarUtil.processedData[functionName][formattedDate];

            if (storedWeek !== undefined) {
                week = storedWeek;
            } else {
                week = CalendarUtil.getDatesInWeek(startDate);
            }

            CalendarUtil.processedData[functionName][formattedDate] = week;

            startDate = CalendarUtil.getNextDate(new Date(week[week.length - 1]));

            if (!includeWeekends) {
                week = week.slice(1, week.length - 1)
            }

            weeks.push(week);

        } while (startDate <= endDate); //If current week is less than the selected end date

        return weeks;
    }

    /*
        Returns a list of weeks given a startDate and the number of weeks
        Example call: CalendarUtil.getWeeksFromStartDate(new Date(), 5, true);
    */
    static getWeeksFromStartDate(startDate: Date, numberOfWeeks: number, includeWeekends: boolean) {
        var weeks = [];
        startDate = CalendarUtil.getFirstDayOfWeekByDate(startDate);

        for (var i = 0; i < numberOfWeeks; i++) {
            var week = CalendarUtil.getDatesInWeek(startDate);
            startDate = CalendarUtil.getNextDate(new Date(week[week.length - 1]));
            if (!includeWeekends) {
                week = week.slice(1, week.length - 1)
            }
            weeks.push(week);
        }

        return weeks;

    }

    static getDateString(date: Date) {
        return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
    }

    static setHoursToZero(date: Date) {
        date.setHours(0, 0, 0, 0);
        return date;

    }

    static prepareDatePickerDate(date: string): Date {
        var splitDate = date.split("-");

        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];

        var splitFormat = CalendarUtil.DATE_FORMAT.split("-");

        var dateOrdered = [];
        splitFormat.forEach(section => {

            switch (section[0]) {
                case 'M':
                    dateOrdered.push(month);
                    break;
                case 'd':
                    dateOrdered.push(day);
                    break;
                case 'y':
                    dateOrdered.push(year);
                    break;
            }
        })

        return new Date(dateOrdered.join("-"));
    }
}

export const DAYS = [
    { isWeekend: true, day: "Sunday", short: "Sun", order: 0 },
    { isWeekend: false, day: "Monday", short: "Mon", order: 1 },
    { isWeekend: false, day: "Tuesday", short: "Tues", order: 2 },
    { isWeekend: false, day: "Wednesday", short: "Wed", order: 3 },
    { isWeekend: false, day: "Thursday", short: "Thurs", order: 4 },
    { isWeekend: false, day: "Friday", short: "Fri", order: 5 },
    { isWeekend: true, day: "Saturday", short: "Sat", order: 6 }

]