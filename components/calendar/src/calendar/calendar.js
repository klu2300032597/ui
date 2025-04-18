import {
    useDatePicker,
    useResolvedDirection,
} from '@dhis2/multi-calendar-dates'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { CalendarContainer } from './calendar-container.js'

export const Calendar = ({
    onDateSelect,
    calendar,
    date,
    dir,
    locale,
    numberingSystem,
    weekDayFormat = 'narrow',
    timeZone,
    width = '240px',
    cellSize = '32px',
    pastOnly,
}) => {
    const [selectedDateString, setSelectedDateString] = useState(date)
    const languageDirection = useResolvedDirection(dir, locale)

    const options = {
        locale,
        calendar,
        timeZone,
        numberingSystem,
        weekDayFormat,
        pastOnly,
    }

    const pickerResults = useDatePicker({
        onDateSelect: (result) => {
            const { calendarDateString } = result
            setSelectedDateString(calendarDateString)
            onDateSelect(result)
        },
        date: selectedDateString,
        options,
    })

    const calendarProps = useMemo(() => {
        return {
            date,
            dir,
            locale,
            width,
            cellSize,
            // minDate,
            // maxDate,
            // validation, // todo: clarify how we use validation props (and format) in Calendar (not CalendarInput)
            // format,
            isValid: pickerResults.isValid,
            calendarWeekDays: pickerResults.calendarWeekDays,
            weekDayLabels: pickerResults.weekDayLabels,
            currMonth: pickerResults.currMonth,
            currYear: pickerResults.currYear,
            nextMonth: pickerResults.nextMonth,
            nextYear: pickerResults.nextYear,
            prevMonth: pickerResults.prevMonth,
            prevYear: pickerResults.prevYear,
            navigateToYear: pickerResults.navigateToYear,
            navigateToMonth: pickerResults.navigateToMonth,
            months: pickerResults.months,
            years: pickerResults.years,
            languageDirection,
        }
    }, [cellSize, date, dir, locale, pickerResults, width, languageDirection])

    return (
        <div>
            <CalendarContainer {...calendarProps} />
        </div>
    )
}

export const CalendarProps = {
    /** the calendar to use such gregory, ethiopic, nepali - full supported list here: https://github.com/dhis2/multi-calendar-dates/blob/main/src/constants/calendars.ts  */
    calendar: PropTypes.any.isRequired,
    /** Called with signature `(null)` \|\| `({ dateCalendarString: string, validation: { error: boolean, warning: boolean, validationText: string} })` with `dateCalendarString` being the stringified date in the specified calendar in the format `yyyy-MM-dd` */
    onDateSelect: PropTypes.func.isRequired,
    /** the size of a single cell in the table forming the calendar */
    cellSize: PropTypes.string,
    /** the currently selected date using an iso-like format YYYY-MM-DD, in the calendar system provided (not iso8601) */
    date: PropTypes.string,
    /** the direction of the library - internally the library will use rtl for rtl-languages but this can be overridden here for more control */
    dir: PropTypes.oneOf(['ltr', 'rtl']),
    /** any valid locale -  if none provided, the internal library will fallback to the user locale (more info here: https://github.com/dhis2/multi-calendar-dates/blob/main/src/hooks/internal/useResolvedLocaleOptions.ts#L15) */
    locale: PropTypes.string,
    /** numbering system to use - full list here https://github.com/dhis2/multi-calendar-dates/blob/main/src/constants/numberingSystems.ts */
    numberingSystem: PropTypes.string,
    /** When true, only shows years in the past (current year and earlier) */
    pastOnly: PropTypes.bool,
    /** the timeZone to use */
    timeZone: PropTypes.string,
    /** the format to display for the week day, i.e. Monday (long), Mon (short), M (narrow) */
    weekDayFormat: PropTypes.oneOf(['narrow', 'short', 'long']),
    /** the width of the calendar component */
    width: PropTypes.string,
}

Calendar.propTypes = CalendarProps
