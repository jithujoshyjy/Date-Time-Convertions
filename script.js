import { DateTime } from "https://cdn.jsdelivr.net/npm/luxon@3.4.2/+esm"

const el = query => document.querySelector(query)
const els = query => document.querySelectorAll(query)
const on = (event, element, handler) => element.addEventListener(event, handler)

const dateCalcFieldLeft = el("input.date-calc-field-left")
const dateOperSelector = el(".date-calc-wrapper > select.operation-selector")
const calcDateResultBtn = el(".date-calc-wrapper > .calc-result > button.calc-result-btn")
const calcDateResultTray = el(".date-calc-wrapper > .calc-result > .calc-result-tray")
const calcDateDayField = el(".date-calc-fields-right > .calc-date-field")
const calcDateMonthField = el(".date-calc-fields-right > .calc-month-field")
const calcDateYearField = el(".date-calc-fields-right > .calc-year-field")

const timeCalcFieldLeft = el("input.time-calc-field-left")
const timeOperSelector = el(".time-calc-wrapper > select.operation-selector")
const calcTimeResultBtn = el(".time-calc-wrapper > .calc-result > button.calc-result-btn")
const calcTimeResultTray = el(".time-calc-wrapper > .calc-result > .calc-result-tray")
const calcTimeHourField = el(".time-calc-fields-right > .calc-hour-field")
const calcTimeMinuteField = el(".time-calc-fields-right > .calc-minute-field")
const calcTimeTimeOfDaySelector = el(".time-calc-fields-right > select.time-of-day-selector")

const dateTimeCalcFieldLeft = el("input.date-time-calc-field-left")
const dateTimeOperSelector = el(".date-time-calc-wrapper > select.operation-selector")
const calcDateTimeResultBtn = el(".date-time-calc-wrapper > .calc-result > button.calc-result-btn")
const calcDateTimeResultTray = el(".date-time-calc-wrapper > .calc-result > .calc-result-tray")
const calcDateTimeDayField = el(".date-time-calc-fields-right > .calc-date-field")
const calcDateTimeMonthField = el(".date-time-calc-fields-right > .calc-month-field")
const calcDateTimeYearField = el(".date-time-calc-fields-right > .calc-year-field")
const calcDateTimeHourField = el(".date-time-calc-fields-right > .calc-hour-field")
const calcDateTimeMinuteField = el(".date-time-calc-fields-right > .calc-minute-field")
const calcDateTimeTimeOfDaySelector = el(".date-time-calc-fields-right > select.time-of-day-selector")

const IST = "Asia/Kolkata"
const CST = "America/Chicago"
const EST = "America/New_York"
const UTC = "UTC"

const dateChangables = [
	dateCalcFieldLeft, dateOperSelector, calcDateDayField, calcDateMonthField, calcDateYearField
]

const timeChangables = [
	timeCalcFieldLeft, timeOperSelector, calcTimeHourField, calcTimeMinuteField, calcTimeTimeOfDaySelector
]

const dateTimeChangables = [
	dateTimeCalcFieldLeft, dateTimeOperSelector, calcDateTimeDayField, calcDateTimeMonthField, calcDateTimeYearField, calcDateTimeHourField, calcDateTimeMinuteField, calcDateTimeTimeOfDaySelector
]

const allChangables = [...dateChangables, ...timeChangables, ...dateTimeChangables]

allChangables.forEach(x => on("change", x, _ => {
	calcDateResultTray.textContent = calcTimeResultTray.textContent = calcDateTimeResultTray.textContent = ''
}))


on("click", calcDateResultBtn, _ => {
	const leftValue = dateCalcFieldLeft.value
	if (leftValue == '') return

	const operation = dateOperSelector.value
	const date = DateTime.fromISO(leftValue)

	const dateValue = Number(calcDateDayField.value.trim().replace(/^0+/, ''))
	const monthValue = Number(calcDateMonthField.value.trim().replace(/^0+/, ''))
	const yearValue = Number(calcDateYearField.value.trim().replace(/^0+/, ''))

	const result = dispatchDateOperation(date, operation, [dateValue, monthValue, yearValue])
	calcDateResultTray.textContent = result
	calcTimeResultTray.textContent = calcDateTimeResultTray.textContent = ''
})

on("click", calcTimeResultBtn, _ => {
	const leftValue = timeCalcFieldLeft.value
	if (leftValue == '') return

	const operation = timeOperSelector.value
	const time = DateTime.fromISO(leftValue)

	const hourValue = Number(calcTimeHourField.value.trim().replace(/^0+/, ''))
	const minuteValue = Number(calcTimeMinuteField.value.trim().replace(/^0+/, ''))
	const timeOfDayValue = Number(calcTimeTimeOfDaySelector.value)

	const result = dispatchTimeOperation(time, operation, [hourValue, minuteValue, timeOfDayValue])
	calcTimeResultTray.textContent = result
	calcDateResultTray.textContent = calcDateTimeResultTray.textContent = ''
})

on("click", calcDateTimeResultBtn, _ => {
	const leftValue = dateTimeCalcFieldLeft.value
	if (leftValue == '') return

	const operation = dateTimeOperSelector.value
	const dateTime = DateTime.fromISO(leftValue)

	const dateValue = Number(calcDateTimeDayField.value.trim().replace(/^0+/, ''))
	const monthValue = Number(calcDateTimeMonthField.value.trim().replace(/^0+/, ''))
	const yearValue = Number(calcDateTimeYearField.value.trim().replace(/^0+/, ''))

	const hourValue = Number(calcDateTimeHourField.value.trim().replace(/^0+/, ''))
	const minuteValue = Number(calcDateTimeMinuteField.value.trim().replace(/^0+/, ''))
	const timeOfDayValue = Number(calcDateTimeTimeOfDaySelector.value)

	const result = dispatchDateTimeOperation(dateTime, operation, [dateValue, monthValue, yearValue, hourValue, minuteValue, timeOfDayValue])
	calcDateTimeResultTray.textContent = result
	calcDateResultTray.textContent = calcTimeResultTray.textContent = ''
})

function dispatchDateOperation(date, operation, ...rest) {
	switch (operation) {
		case "plus":
			return addDate(date, ...rest)
		case "minus":
			return subtractDate(date, ...rest)
		case "diff":
			return diffDate(date, ...rest)
	}
}

function addDate(date, [days, months, years]) {
	return date.plus({ days, months, years }).toFormat("dd/MM/yyyy")
}

function subtractDate(date, [days, months, years]) {
	return date.minus({ days, months, years }).toFormat("dd/MM/yyyy")
}

function diffDate(date, [day, month, year]) {
	const date2 = DateTime.fromObject({ day, month, year })
	return date
		.diff(date2, ["days", "months", "years"])
		.toFormat("'days: 'dd', months: 'MM', years: 'yyyy")
}

function dispatchTimeOperation(time, operation, ...rest) {
	switch (operation) {
		case "plus":
			return addTime(time, ...rest)
		case "minus":
			return subtractTime(time, ...rest)
		case "diff":
			return diffTime(time, ...rest)
		case "to-ist":
			return convertTimeToIST(time)
		case "to-cst":
			return convertTimeToCST(time)
		case "to-est":
			return convertTimeToEST(time)
		case "to-utc":
			return convertTimeToUTC(time)
	}
}

function addTime(time, [hours, minutes]) {
	return time.plus({ hours, minutes }).toFormat("hh:mm a")
}

function subtractTime(time, [hours, minutes]) {
	return time.minus({ hours, minutes }).toFormat("hh:mm a")
}

function diffTime(time, [hour, minute, timeOfDay]) {
	const time2 = DateTime.fromObject({ hour: timeOfDay == "pm" ? hour + 12 : hour, minute })
	return time
		.diff(time2, ["hours", "minutes"])
		.toFormat("'hours: 'hh', minutes: 'mm")
}

function convertTimeToIST(time) {
	return time
		.setZone(IST)
		.toFormat("hh:mm a")
}

function convertTimeToCST(time) {
	return time
		.setZone(CST)
		.toFormat("hh:mm a")
}

function convertTimeToEST(time) {
	return time
		.setZone(EST)
		.toFormat("hh:mm a")
}

function convertTimeToUTC(time) {
	return time
		.setZone(UTC)
		.toFormat("hh:mm a")
}

function dispatchDateTimeOperation(dateTime, operation, ...rest) {
	switch (operation) {
		case "plus":
			return addDateTime(dateTime, ...rest)
		case "minus":
			return subtractDateTime(dateTime, ...rest)
		case "diff":
			return diffDateTime(dateTime, ...rest)
		case "to-ist":
			return convertDateTimeToIST(dateTime)
		case "to-cst":
			return convertDateTimeToCST(dateTime)
		case "to-est":
			return convertDateTimeToEST(dateTime)
		case "to-utc":
			return convertDateTimeToUTC(dateTime)
	}
}

function addDateTime(dateTime, [days, months, years, hours, minutes]) {
	return dateTime.plus({ days, months, years, hours, minutes }).toFormat("dd/MM/yyyy hh:mm a")
}

function subtractDateTime(dateTime, [days, months, years, hours, minutes]) {
	return dateTime.minus({ days, months, years, hours, minutes }).toFormat("dd/MM/yyyy hh:mm a")
}

function diffDateTime(dateTime, [day, month, year, hour, minute, timeOfDay]) {
	const dateTime2 = DateTime.fromObject({
		day, month, year,
		hour: timeOfDay == "pm" ? hour + 12 : hour, minute
	})
	return dateTime
		.diff(dateTime2, ["days", "months", "years", "hours", "minutes"])
		.toFormat("'days: 'dd', months: 'MM', years: 'yyyy', hours: 'hh', minutes: 'mm")
}

function convertDateTimeToIST(dateTime) {
	return dateTime
		.setZone(IST)
		.toFormat("dd/MM/yyyy hh:mm a")
}

function convertDateTimeToCST(dateTime) {
	return dateTime
		.setZone(CST)
		.toFormat("dd/MM/yyyy hh:mm a")
}

function convertDateTimeToEST(dateTime) {
	return dateTime
		.setZone(EST)
		.toFormat("dd/MM/yyyy hh:mm a")
}

function convertDateTimeToUTC(dateTime) {
	return dateTime
		.setZone(UTC)
		.toFormat("dd/MM/yyyy hh:mm a")
}