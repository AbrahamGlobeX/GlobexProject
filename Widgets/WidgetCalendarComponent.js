class WidgetCalendar extends BaseWidget {

	constructor() {
		super();
		// this.createDomElement("div");
	}

	onCreate() {
		this.addClassName("Calendar");
		this.monthCode = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
		this.dayCode = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];

		this.calendarType = 1;	// Тип предназначения календаря (просто смотреть/ выбор даты / выбор периода / выбор недели)

		this.day = new Date().getDate();		// Установленный день
		this.month = new Date().getMonth() + 1;	// Установленный месяц
		this.year = new Date().getFullYear();	// Установленный год

		this.secondaryDay = this.day;		// Второй Установленный для диапазона день 
		this.secondaryMonth = this.month;	// Второй Установленный для диапазона месяц 
		this.secondaryYear = this.year;		// Второй Установленный для диапазона год

		this.todayDay = new Date().getDate();			// Текущий день на стороне клиента
		this.todayMonth = new Date().getMonth() + 1;	// Текущий месяц на стороне клиента
		this.todayYear = new Date().getFullYear();		// Текущий год на стороне клиента

		this.viewMonth = this.month;	// Отображаемый месяц 
		this.viewYear = this.year;		// Отображаемый год 

		this.holidays = []; // Праздники
		this.events = [];	// Пользовательские события

		this.chooseYear = false;

		// HEADER
		this.htmlHeader = document.createElement("div");
		this.htmlHeader.className = "CalendarHeader";

		this.htmlCurrentYear = document.createElement("div");
		this.htmlCurrentYear.className = "CurrentYear";
		this.htmlCurrentYear.textContent = this.year;

		this.htmlCurrentDate = document.createElement("div");
		this.htmlCurrentDate.className = "CurrentDate";
		this.htmlCurrentDate.style.color = "#fff";
		this.updateCurrentDate();

		this.htmlHeader.appendChild(this.htmlCurrentYear);
		this.htmlHeader.appendChild(this.htmlCurrentDate);

		// DATA CONTENT
		this.htmlDateContent = document.createElement("div");
		this.htmlDateContent.className = "CalendarDateContent";

		// navigation month
		this.htmlMonthNavigator = document.createElement("div");
		this.htmlMonthNavigator.className = "MonthNavigator";

		this.htmlLeftNav = document.createElement("div");
		this.htmlLeftNav.className = "LeftNav";
		this.htmlLeftNav.textContent = "keyboard_arrow_left";

		this.htmlCurrentMonth = document.createElement("div");
		this.htmlCurrentMonth.className = "CurrentMonth";
		this.updateCurrentMoth();

		this.htmlRightNav = document.createElement("div");
		this.htmlRightNav.className = ("RightNav");
		this.htmlRightNav.textContent = "keyboard_arrow_right";

		// week
		this.htmlWeek = document.createElement("div");
		this.htmlWeek.className = "Week";

		for (let dayCode of this.dayCode) {
			let d = document.createElement("div");
			d.textContent = dayCode;
			d.classList.add("Unselectable");
			d.className = "WeekDay";
			this.htmlWeek.appendChild(d);

		}

		// calendar grid
		this.htmlCalendarGrid = document.createElement("div");
		this.htmlCalendarGrid.className = "CalendarGrid";
		this.updateCalendarGrid();

		this.htmlMonthNavigator.appendChild(this.htmlLeftNav);
		this.htmlMonthNavigator.appendChild(this.htmlCurrentMonth);
		this.htmlMonthNavigator.appendChild(this.htmlRightNav);
		this.htmlDateContent.appendChild(this.htmlMonthNavigator);
		this.htmlDateContent.appendChild(this.htmlWeek);
		this.htmlDateContent.appendChild(this.htmlCalendarGrid);

		// YEAR CONTENT
		this.htmlYearContent = document.createElement("div");
		this.htmlYearContent.className = "CalendarYearContent";

		this.htmlElement.appendChild(this.htmlHeader);
		this.htmlElement.appendChild(this.htmlDateContent);
		this.htmlElement.appendChild(this.htmlYearContent);
		this.htmlHeader.classList.add("Unselectable");
		this.htmlCurrentYear.classList.add("Unselectable");
		this.htmlCurrentDate.classList.add("Unselectable");
		this.htmlDateContent.classList.add("Unselectable");
		this.htmlMonthNavigator.classList.add("Unselectable");
		this.htmlLeftNav.classList.add("Unselectable");
		this.htmlCurrentMonth.classList.add("Unselectable");
		this.htmlRightNav.classList.add("Unselectable");
		this.htmlWeek.classList.add("Unselectable");
		this.htmlCalendarGrid.classList.add("Unselectable");
		this.htmlYearContent.classList.add("Unselectable");

	}

	eventHandler(eventType, eventObject) {

		eventObject.persist();
		console.log(eventType, eventObject);
		this.onMouseDown(eventObject);
		Module.Store.dispatch({
			'eventName': this.props.widgets[this.id].events[eventType],
			'value': eventObject
		});
	}

	onMouseDown(event) {
		let pressElement = event.target;
		if (pressElement == null) return;

		if (pressElement.classList.contains("LeftNav")) {
			this.prevMonth();
			this.updateCurrentMoth();
			this.updateCalendarGrid();
		} else if (pressElement.classList.contains("RightNav")) {
			this.nextMonth();
			this.updateCurrentMoth();
			this.updateCalendarGrid();
		} else if (pressElement.classList.contains("CurrentYear")) {
			this.changeYear();
		} else if (pressElement.classList.contains("CurrentDate")) {
			this.changeDate();
		} else if (pressElement.classList.contains("Year")) {
			let y = pressElement.dataset.year;
			this.viewYear = parseInt(y);
			this.changeDate();
		}

		if (this.calendarType == 0) return;

		//Выбор числа
		if (this.calendarType == 1) {
			// Нажатие на день
			if (pressElement.classList.contains("Day")) {
				let d = pressElement.dataset.day;
				let m = pressElement.dataset.month;
				let y = pressElement.dataset.year;
				this.setDay(parseInt(d));
				this.setMonth(parseInt(m));
				this.setYear(parseInt(y));
			} else
				return;
		}

		//Выбор второго значения для диапазона
		if (this.calendarType == 2) {
			if (pressElement.classList.contains("Day")) {
				let d = parseInt(pressElement.dataset.day);
				let m = parseInt(pressElement.dataset.month);
				let y = parseInt(pressElement.dataset.year);

				let date = new Date(y, m, d);
				let date1 = new Date(this.year, this.month, this.day);
				let date2 = new Date(this.secondaryYear, this.secondaryMonth, this.secondaryDay);

				if (event.button == 0) {
					if (date > date2) {
						this.setSecondaryDay((d));
						this.setSecondaryMonth((m));
						this.setSecondaryYear((y));
					} else {
						this.setDay((d));
						this.setMonth((m));
						this.setYear((y));
					}
				}

				if (event.button == 2) {
					if (date < date1) {
						this.setDay((d));
						this.setMonth((m));
						this.setYear((y));
					} else {
						this.setSecondaryDay((d));
						this.setSecondaryMonth((m));
						this.setSecondaryYear((y));
					}
				}

			}
		}

		// Выбор недели
		if (this.calendarType == 3) {
			if (pressElement.classList.contains("Day")) {
				let d = parseInt(pressElement.dataset.day);
				let m = parseInt(pressElement.dataset.month);
				let y = parseInt(pressElement.dataset.year);

				let date = new Date(y, m - 1, d);
				let date1 = new Date(date - (this.getDayOfTheWeek(d, m, y) * 86400000));
				let date2 = new Date(date1 - 1 + (6 * 86400000) + 1);

				this.setDay(date1.getDate());
				this.setMonth(date1.getMonth() + 1);
				this.setYear(date1.getFullYear());

				this.setSecondaryDay(date2.getDate());
				this.setSecondaryMonth(date2.getMonth() + 1);
				this.setSecondaryYear(date2.getFullYear());
			}
		}
	}

	render() {

		const widget = this.props.widgets[this.id];

		let eventAttributes = {};


		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}

		// return (
		// 	// Base Calendar Html
		// 	<div
		// 		id={this.id}
		// 		className="Calendar"
		// 		{...widget.attributes}
		// 		{...eventAttributes}

		// 	>
		// 		<div
		// 			id={"calendarHeader_" + this.id}
		// 			className="CalendarHeader"
		// 		>
		// 			<div
		// 				id={"currentYear_" + this.id}
		// 				className="CurrentYear"
		// 			>
		// 			</div>
		// 			<div
		// 				id={"currentDate_" + this.id}
		// 				className="CurrentDate"
		// 			>
		// 			</div>
		// 		</div>
		// 		<div
		// 			id={"calendarDateContent_" + this.id}
		// 			className="CalendarDateContent"
		// 		>
		// 			<div
		// 				id={"monthNavigator_" + this.id}
		// 				className="MonthNavigator"
		// 			>
		// 				<div
		// 					id={"leftNav_" + this.id}
		// 					className="LeftNav"
		// 				>
		// 				</div>
		// 				<div
		// 					id={"currentMonth_" + this.id}
		// 					className="CurrentMonth"
		// 				>
		// 				</div>
		// 				<div
		// 					id={"rightNav_" + this.id}
		// 					className="RightNav"
		// 				>
		// 				</div>
		// 			</div>
		// 			<div
		// 				id={"week_" + this.id}
		// 				className="Week"
		// 			>
		// 			</div>
		// 			<div
		// 				id={"calendarGrid_" + this.id}
		// 				className="CalendarGrid"
		// 			>
		// 			</div>
		// 		</div>
		// 		<div
		// 			id={"calendarYearContent_" + this.id}
		// 			className="CalendarYearContent"
		// 		>
		// 		</div>
		// 	</div>
		// );

	}

	onComponentDidMount() {

		// this.htmlHeader = document.getElementById("calendarHeader_" + this.id);
		// this.htmlCurrentYear = document.getElementById("currentYear_" + this.id);
		// this.htmlCurrentYear.textContent = this.year;
		// this.htmlCurrentDate = document.getElementById("currentDate_" + this.id);
		// this.htmlCurrentDate.style.color = "#fff";
		// this.updateCurrentDate();
		// this.htmlDateContent = document.getElementById("calendarDateContent_" + this.id);
		// this.htmlMonthNavigator = document.getElementById("monthNavigator_" + this.id);

		// this.htmlLeftNav = document.getElementById("leftNav_" + this.id);
		// this.htmlLeftNav.textContent = "keyboard_arrow_left";
		// this.htmlCurrentMonth = document.getElementById("currentMonth_" + this.id);
		// this.updateCurrentMoth();
		// this.htmlRightNav = document.getElementById("rightNav_" + this.id);
		// this.htmlRightNav.textContent = "keyboard_arrow_right";

		// this.htmlWeek = document.getElementById("week_" + this.id);
		// for (let dayCode of this.dayCode) {
		// 	let d = document.createElement("div");
		// 	d.textContent = dayCode;
		// 	d.className = "WeekDay";
		// 	d.classList.add("Unselectable");
		// 	this.htmlWeek.appendChild(d);

		// }

		// this.htmlCalendarGrid = document.getElementById("calendarGrid_" + this.id);
		// this.updateCalendarGrid();
		// this.htmlYearContent = document.getElementById("calendarYearContent_" + this.id);

		// this.htmlHeader.classList.add("Unselectable");
		// this.htmlCurrentYear.classList.add("Unselectable");
		// this.htmlCurrentDate.classList.add("Unselectable");
		// this.htmlDateContent.classList.add("Unselectable");
		// this.htmlMonthNavigator.classList.add("Unselectable");
		// this.htmlLeftNav.classList.add("Unselectable");
		// this.htmlCurrentMonth.classList.add("Unselectable");
		// this.htmlRightNav.classList.add("Unselectable");
		// this.htmlWeek.classList.add("Unselectable");
		// this.htmlCalendarGrid.classList.add("Unselectable");
		// this.htmlYearContent.classList.add("Unselectable");

	}

	setDay(value) {
		if (this.day == value) return;
		this.day = value;
		this.updateCurrentDate();
		this.updateCalendarGrid();
	}

	setMonth(value) {
		if (this.month == value) return;
		this.month = value;
		this.viewMonth = value;
		this.updateCurrentDate();
		this.updateCurrentMoth();
		this.updateCalendarGrid();
	}

	setYear(value) {
		if (this.year == value) return;
		this.year = value;
		this.viewYear = value;
		this.updateCurrentYear();
		this.updateCurrentMoth();
		this.updateCurrentDate();
		this.updateCalendarGrid();
	}

	setSecondaryDay(value) {
		if (this.secondaryDay == value) return;
		this.secondaryDay = value;
		this.updateCurrentDate();
		this.updateCalendarGrid();
		this.updateCurrentYear();
	}
	setSecondaryMonth(value) {
		if (this.secondaryMonth == value) return;
		this.secondaryMonth = value;
		this.updateCurrentDate();
		this.updateCalendarGrid();
		this.updateCurrentYear();
	}
	setSecondaryYear(value) {
		if (this.secondaryYear == value) return;
		this.secondaryYear = value;
		this.updateCurrentDate();
		this.updateCalendarGrid();
		this.updateCurrentYear();
	}


	nextMonth() {
		++this.viewMonth;
		if (this.viewMonth > 12) {
			this.viewMonth = 1;
			++this.viewYear;
			if (this.htmlCurrentYear != null) this.htmlCurrentYear.textContent = this.viewYear;

		}
	}

	prevMonth() {
		--this.viewMonth;
		if (this.viewMonth < 1) {
			this.viewMonth = 12;
			--this.viewYear;
			if (this.htmlCurrentYear != null) this.htmlCurrentYear.textContent = this.viewYear;
		}
	}

	changeYear() {
		this.chooseYear = true;
		this.htmlYearContent.style.visibility = "visible";
		this.htmlYearContent.style.height = "";
		this.htmlCurrentYear.style.color = "#fff";

		this.htmlDateContent.style.visibility = "hidden";
		this.htmlDateContent.style.height = "0px";
		this.htmlCurrentDate.style.color = "";

		this.updateYears();
	}

	updateYears() {
		// Clear old data
		for (let i = 0; i < this.htmlYearContent.childNodes.length; ++i) {
			let nodeChild = this.htmlYearContent.childNodes[i];
			this.htmlYearContent.removeChild(nodeChild);
			--i;
		}

		for (let i = this.year - 100; i < this.year + 100; ++i) {
			let year = document.createElement("div");
			this.htmlYearContent.appendChild(year);
			year.className = "Year";
			year.textContent = i;
			year.dataset.year = i;
			if (i == this.year) {
				year.style.color = "#009688";
				year.style.fontSize = "25px";
			}

		}

		this.htmlYearContent.scrollTop = this.htmlYearContent.scrollHeight / 2 - 120;
	}

	changeDate() {
		this.chooseYear = false;
		this.htmlYearContent.style.visibility = "hidden";
		this.htmlYearContent.style.height = "0px";
		this.htmlCurrentYear.style.color = "";

		this.htmlDateContent.style.visibility = "visible";
		this.htmlDateContent.style.height = "";
		this.htmlCurrentDate.style.color = "#fff";

		if (this.htmlCurrentYear != null) this.htmlCurrentYear.textContent = this.viewYear;
		this.updateCurrentMoth();
		this.updateCalendarGrid();
	}

	updateCalendarGrid() {
		if (this.htmlCalendarGrid == null) return;

		// Clear old data
		for (let i = 0; i < this.htmlCalendarGrid.childNodes.length; ++i) {
			let nodeChild = this.htmlCalendarGrid.childNodes[i];
			this.htmlCalendarGrid.removeChild(nodeChild);
			--i;
		}

		let date = new Date(this.viewYear, this.viewMonth - 1, 1);

		let weekDay = this.getDayOfTheWeek(1, this.viewMonth, this.viewYear);
		if (weekDay == 0) date = new Date(date - (7 * 86400000));
		else date = new Date(date - (weekDay * 86400000));

		for (let i = 0; i < 6; ++i) {

			let w = document.createElement("div");
			this.htmlCalendarGrid.appendChild(w);
			w.className = "Week";

			for (let j = 0; j < 7; ++j) {
				// ++indexDay;

				let d = document.createElement("div");
				w.appendChild(d);
				d.className = "Day";

				this.checkDayEvent(d, date.getDate(), date.getMonth() + 1, date.getFullYear());
				date = new Date((date - 1) + 86400001);
			}
		}
	}

	checkDayEvent(node, d, m, y) {
		if (node == null || d == null || m == null || y == null) return;
		node.textContent = d;
		node.dataset.day = d;
		node.dataset.month = m;
		node.dataset.year = y;

		let date = new Date(y, m - 1, d);
		let date1 = new Date(this.year, this.month - 1, this.day);
		let date2 = new Date(this.secondaryYear, this.secondaryMonth - 1, this.secondaryDay);

		let personEvent = this.getPersonEvent(d, m, y);

		// ВОСКРЕСЕНЬЕ
		if (date.getDay() == 0) {
			node.style.color = "red";
		}

		// СЕГОДНЯШНИЙ ДЕНЬ
		if ((this.todayDay == d) && (this.todayMonth == m) && (this.todayYear == y)) {
			node.style.color = "#2bbbad";
		}

		// Выбранный день
		if ((this.day == d) && (this.month == m) && (this.year == y)) {
			node.style.background = "#009688";
			node.style.color = "white";
		}

		// Выбранный период
		if (this.calendarType == 2 || this.calendarType == 3) {
			if (date1 <= date && date <= date2) {
				node.style.background = "#009688";
				node.style.color = "white";
			}
		}

		if (m != this.viewMonth) {
			node.style.color = "#a09595";
			if (date.getDay() == 0) node.style.color = "#f5a5a5";
		}

		// ПОЛЬЗОВАТЕЛЬСКИЙ ПРАЗДНИК
		if (this.isHolidays(d, m, y)) {
			node.style.color = "red";
		}

		// ПОЛЬЗОВАТЕЛЬСКОЕ СОБЫТИЕ
		if (personEvent != null) {
			node.style.color = personEvent.color;
			node.title = personEvent.title;
		}

	}


	updateCurrentMoth() {
		if (this.htmlDateContent == null) return;
		this.htmlCurrentMonth.textContent = this.monthCode[this.viewMonth - 1] + " " + this.viewYear;
	}

	updateCurrentDate() {
		if (this.htmlCurrentDate == null) return;

		// VIEW or SELECTION
		if (this.calendarType == 0 || this.calendarType == 1)
			this.htmlCurrentDate.textContent = this.dayCode[this.getDayOfTheWeek(this.day, this.month, this.year)] + ", " + this.monthCode[this.month - 1] + " " + this.day;

		// RANGE
		if (this.calendarType == 2) {
			let t = this.day + "." + this.month + "." + this.year % 1000 + " - " + this.secondaryDay + "." + this.secondaryMonth + "." + this.secondaryYear % 1000;
			this.htmlCurrentDate.textContent = t;
		}

		// WEEK
		if (this.calendarType == 3) {
			let w = this.getNumberWeek(this.day, this.month, this.year);
			let text = this.day + "." + this.month + "." + this.year % 1000 + " - " + this.secondaryDay + "." + this.secondaryMonth + "." + this.secondaryYear % 1000;
			this.htmlCurrentDate.textContent = text;
		}

	}

	getDayOfTheWeek(day, month, year) {
		let _d = day;
		let _m = month;
		let _y = year;
		if ((day === undefined) || (month === undefined) || (year === undefined)) {
			_d = this.day;
			_m = this.month;
			_y = this.year;
		}
		_d = parseInt(_d, 10);
		_m = parseInt(_m, 10);
		_y = parseInt(_y, 10);

		let a = parseInt((14 - _m) / 12, 10);
		let y = _y - a;
		let m = _m + 12 * a - 2;
		return parseInt(((_d + y + parseInt(y / 4, 10) - parseInt(y / 100, 10) + parseInt(y / 400, 10) + (31 * m) / 12) % 7), 10);
	}

	//[31, (28|29), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	getCountMonthDays(month, year) {
		//return 28 + ((month + Math.floor( / 8)) % 2) + 2 % month + Math.floor((1 + (1 - (year % 4 + 2) % (year % 4 + 1)) * ((year % 100 + 2) % (year % 100 + 1)) + (1 - (year % 400 + 2) % (year % 400 + 1))) / month) + Math.floor(1 / month) - Math.floor(((1 - (year % 4 + 2) % (year % 4 + 1)) * ((year % 100 + 2) % (year % 100 + 1)) + (1 - (year % 400 + 2) % (year % 400 + 1))) / month);
		let data = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (month != 2) return data[month - 1];
		else if (year % 4 == 0) return 29;
		return 28;
	}

	getCountDataDays(d, m, y) {
		let count = 0;
		for (let i = 1; i < m; ++i) count += this.getCountMonthDays(i, y);
		return count + d;
	}

	getNumberWeek(d, m, y) {
		let n = this.getCountDataDays(d, m, y);
		return Math.floor((((n - 1) / 7) + 1));
	}

	getPersonEvent(d, m, y) {
		for (let i = 0; i < this.events.length; ++i) {
			let e = this.events[i];
			if (e.day == d && e.month == m && e.year == y) return e;
		}
		return null;
	}

	isHolidays(day, month, year) {
		for (let i = 0; i < this.holidays.length; ++i) {
			let h = this.holidays[i];
			if (h.day == day && h.month == month && h.year == year) return true;
		}
		return false;
	}

	// addMonth() {
	// 	++this.viewMonth;
	// 	++this.month;
	// 	if (this.viewMonth > 12 || this.month > 12) {
	// 		this.viewMonth = 1;
	// 		this.month = 1;
	// 		++this.viewYear;
	// 		++this.year;
	// 	}
	// 	this.update();
	// }

	// remMonth() {
	// 	--this.month;
	// 	--this.viewMonth;
	// 	if (this.viewMonth < 1 || this.month < 1) {
	// 		this.viewMonth = 12;
	// 		this.month = 12;
	// 		--this.viewYear;
	// 		--this.year;
	// 	}
	// 	this.update();
	// }


}
