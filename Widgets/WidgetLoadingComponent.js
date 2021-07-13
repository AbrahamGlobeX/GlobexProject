
var progressColor = "rgb(38,37,38)"
var colorDots = "#00FF";
var colorText = "#FFFFFF";

class WidgetLoading extends BaseWidget {

	constructor() {
		super();
		// this.htmlElement = document.createElement("div");
		this.addClassName("WidgetLoading");

		this.show = false;
		this.needProgressBar = false;
		this.loadingDataSize = 0;
		this.dataSize = 100;
		this.progressBarType = 0;
		this._loadTime = 10;
		this.loadingTime = 0;
		this.flag = true;
		this.colorProgressBar = progressColor;
		this.colorDots = colorDots;
		this.textLoading = "";
		this.textColor = colorText;
		this.parentWidget = null;
		this.parentWidgetHtml = null;
		this._$loaderHtmlElement = null;
		this._$loaderInner = null;
		this._$textSpan = null;
		this._$ppcSpan = null;
		this._$ppcProgressFill = null;
		this._$progressPieChart = null;
		this.containerElement = document.getElementById("container1");

	}

	eventHandler(eventType, eventObject) {

		eventObject.persist();
		console.log(eventType, eventObject);
		let widgetWindow = null;
		for( let i = 1; i < idWidgets; i++){
			widgetWindow = document.getElementById("divWindow_widget_" + i);
			if(widgetWindow) break;
		}
		if (widgetWindow) widgetWindow.parentThis.inverseEnableHeader();
		Module.Store.dispatch({
			'eventName': this.props.widgets[this.id].events[eventType],
			'value': eventObject
		});
	}

	render() {

		const widget = this.props.widgets[this.id];

		let eventAttributes = {};
		
		
		for (let eventName in widget.events) {
			eventAttributes[eventName] = (event) => this.eventHandler(eventName, event);
		}
		
		return (
			// Base Loading Html
			<div 
				id={this.id} 
				className="WidgetLoading"
				{...widget.attributes}
				{...eventAttributes}
			>
			</div>
		);

	}
	
	onComponentDidMount() {

	}

	onInit() {
		this.htmlElement.style.display = "none";
	}

	onDestroy() {
		if (this._$loaderInner != undefined) this._$loaderInner.remove();
	}

	onSetState(state) {
		if (state.backgroundColor != null && state.backgroundColor !== "" && this._$loaderHtmlElement != null) {
			this._$loaderHtmlElement.style.setProperty("--wl-background-color-main", this.backgroundColor);
			this._$loaderHtmlElement.style.setProperty("--wl-background-color-main-non-opacity", this.getColorWithoutTransparency(this.backgroundColor));
		}

		if (state.colorProgressBar != null && state.colorProgressBar !== "" && this._$loaderHtmlElement != null) {
			this._$loaderHtmlElement.style.setProperty("--wl-progress-color", this.colorProgressBar);
		}

		if (state.colorDots != null && state.colorDots !== "" && this._$loaderHtmlElement != null) {
			this._$loaderHtmlElement.style.setProperty("--wl-color-dots", this.colorDots);
		}

		if (state.textColor != null && state.textColor !== "" && this._$loaderHtmlElement != null) {
			this._$loaderHtmlElement.style.setProperty("--wl-color-text", this.textColor);
		}

		if (state.needProgressBar != null) {
			this.needProgressBar = state.needProgressBar;
		}

		if (state.textLoading != null) {
			if (this.textLoading !== "" && this._$textSpan) this._$textSpan.innerText = state.textLoading
			if (state.textLoading === "" && this._$textSpan) {
				this._$textSpan.style.display = "none !important";
				this._$textSpan.style.setProperty("display", "none !important");
			}
			this.textLoading = state.textLoading;
		}

		if (state.show != null) {
			this.show = state.show;
			if (this.show) {
				this.loadingTime = 0;
				this.startLoader();
			} else {
				this.loadingTime = this.loadTime;
				this.stopLoader();
			}
		}

		if (state.progressBarType != null) {
			this.progressBarType = state.progressBarType;
		}

		if (state.loadTime != null) {
			this._loadTime = state.loadTime;
			if (this.show && this.progressBarType === 1) {
				this.flag = false;
			}
		}

		if (state.dataSize != null) this.dataSize = state.dataSize;

		if (state.loadingDataSize != null) {
			this.loadingDataSize = state.loadingDataSize;
			if (this.show && this.progressBarType === 0)
				this._$changePercent(this._$convertLoadingDataSizeToPercent());
		}
	}

	startLoader() {
		if (this._$loaderHtmlElement != null) return;
		if (this.parentId == -1) {
			this.parentWidgetHtml = this.containerElement;
		} else {
			if (Rex.widgets == null) return;
			this.parentWidget = Rex.widgets[this.parentId];
			if (this.parentWidget == null) return;
			this.parentWidgetHtml = this.parentWidget.view.htmlElement;
			if (this.parentWidgetHtml == null) return;
		}

		this._$loaderHtmlElement = document.createElement("div");
		if (this.needProgressBar)
			this._$loaderHtmlElement.classList.add("cs-loader-with-progress");
		else this._$loaderHtmlElement.classList.add("cs-loader");
		this._$loaderHtmlElement.id = "loader-" + this.id;
		this.containerElement.appendChild(this._$loaderHtmlElement);

		if (this.backgroundColor != null && this.backgroundColor !== "") {
			this._$loaderHtmlElement.style.setProperty("--wl-background-color-main", this.backgroundColor);
			this._$loaderHtmlElement.style.setProperty("--wl-background-color-main-non-opacity", this.getColorWithoutTransparency(this.backgroundColor));
		}

		if (this.colorProgressBar != null && this.colorProgressBar !== "") {
			this._$loaderHtmlElement.style.setProperty("--wl-progress-color", this.colorProgressBar);
		}

		if (this.colorDots != null && this.colorDots !== "") {
			this._$loaderHtmlElement.style.setProperty("--wl-color-dots", this.colorDots);
		}

		if (this.textColor != null && this.textColor !== "") {
			this._$loaderHtmlElement.style.setProperty("--wl-color-text", this.textColor);
		}

		this._$loaderInner = document.createElement("div");
		if (this.needProgressBar) this._$loaderInner.classList.add("cs-loader-inner-with-progress");
		// else this._$loaderInner.classList.add("cs-loader-inner");
		else this._$loaderInner.classList.add("cssload-container");

		this._$loaderHtmlElement.appendChild(this._$loaderInner);

		// let label1 = document.createElement("label");
		// label1.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label1);

		// let label2 = document.createElement("label");
		// label2.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label2);

		// let label3 = document.createElement("label");
		// label3.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label3);

		// let label4 = document.createElement("label");
		// label4.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label4);

		// let label5 = document.createElement("label");
		// label5.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label5);

		// let label6 = document.createElement("label");
		// label6.innerText = "\tfiber_manual_record";
		// this._$loaderInner.appendChild(label6);



		this.divChilds = {};

		if (this.needProgressBar) {
			for (let i = 0; i < 21; i++) {
				if (i == 0) {
					if (this.textLoading === "") this.textLoading = "Loading..";
					this._$textSpan = document.createElement("div");
					this._$textSpan.innerText = this.textLoading;
					this._$textSpan.style.color = this.textColor;
					this._$textSpan.style.fontFamily = "Arial";
					this._$textSpan.style.fontSize = "24px";
					this._$textSpan.style.display = "absolute !important";
					this._$loaderInner.appendChild(this._$textSpan);

					let div = document.createElement("div");
					if (this.progressBarType === 0) div.innerText = "\t0%";
					if (this.progressBarType === 1) div.innerText = "0\t0sec.";
					this.oldPercent = 0;
					div.style.color = this.textColor;
					div.style.fontFamily = "Arial";
					div.style.fontSize = "24px";
					div.style.display = "absolute !important";
					this.divChilds[i] = div;
					this._$loaderInner.appendChild(div);
				} else {
					let label = document.createElement("label");
					label.style.color = this.colorProgressBar;
					if (i % 2 == 0) label.style.setProperty("border-bottom", "6px solid " + this.colorProgressBar);
					else label.style.setProperty("border-top", "6px solid " + this.colorProgressBar);
					this.divChilds[i] = label;
					this._$loaderInner.appendChild(label);
				}
			}
		} else {
			for (let i = 0; i < 21; i++) {
				if (i == 0) {
					if (this.textLoading === "") this.textLoading = "Loading..";
					this._$textSpan = document.createElement("label");
					this._$textSpan.innerText = this.textLoading;
					this._$textSpan.style.color = this.textColor;
					this._$textSpan.style.fontFamily = "Arial";
					this._$textSpan.style.fontSize = "24px";
					this._$textSpan.style.display = "display: block !important";
					this._$textSpan.style.setProperty("display", "block !important");
					this._$loaderInner.appendChild(this._$textSpan);

					let label = document.createElement("label");
					label.innerText = "\t";
					this._$loaderInner.appendChild(label);

				} else {
					let div = document.createElement("div");
					div.classList.add("cssload-shaft" + i);
					if (i % 2 == 0) div.style.setProperty("border-bottom", "6px solid " + this.colorProgressBar);
					else div.style.setProperty("border-top", "6px solid " + this.colorProgressBar);
					this._$loaderInner.appendChild(div);
				}
			}
		}

		if (this.needProgressBar) {
			// this._$progressPieChart = document.createElement("div");
			// this._$progressPieChart.classList.add("progress-pie-chart");
			// this._$progressPieChart.id = "progress-pie-chart-" + this.id;
			// this._$progressPieChart.setAttribute("data-percent", "0");
			// this._$loaderHtmlElement.appendChild(this._$progressPieChart);

			// this._$ppcProgress = document.createElement("div");
			// this._$ppcProgress.classList.add("ppc-progress");
			// this._$progressPieChart.appendChild(this._$ppcProgress);

			// this._$ppcProgressFill = document.createElement("div");
			// this._$ppcProgressFill.classList.add("ppc-progress-fill");
			// this._$ppcProgressFill.id = "ppc-progress-fill-" + this.id;
			// this._$ppcProgress.appendChild(this._$ppcProgressFill);

			// this._$ppPercent = document.createElement("div");
			// this._$ppPercent.classList.add("ppc-percents");
			// this._$progressPieChart.appendChild(this._$ppPercent);

			// let ppPercentWrapper = document.createElement("div");
			// ppPercentWrapper.classList.add("pcc-percents-wrapper");
			// this._$ppPercent.appendChild(ppPercentWrapper);

			// this._$ppcSpan = document.createElement("span");
			// this._$ppcSpan.id = "ppc-span-" + this.id;
			// if (this.progressBarType === 0)
			// 	this._$ppcSpan.innerText = "0%";
			// if (this.progressBarType === 1)
			// 	this._$ppcSpan.innerText = "0\nsec.";
			// ppPercentWrapper.appendChild(this._$ppcSpan);
		}

		this._$updateLoaderPos();

		// создаем экземпляр наблюдателя за контейнером, чтобы узнать, когда там происходят изменения.
		try {
			this._$observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					//если его нет - досвидания.
					if (this.parentWidgetHtml == null) return;
					//пытаемся достать сам лоадер
					this._$updateLoaderPos();
				});
			});
		} catch (e) {
			console.error("Error MutationObserver RexWidgetLoadingHtml", e);
		}

		// настраиваем наблюдатель. следит за чилдами и свойствами.
		let config = {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["style"]
		};
		// передаем элемент и настройки в наблюдатель
		let target = undefined;
		if (this.parentId == -1)
			target = this.parentWidgetHtml;
		else {
			target = this._$getRootParent(this.widget);
			if (target == null || target.view == null || target.view.htmlElement == null) {
				console.error("Can't find root element!");
				return;
			}
			target = target.view.htmlElement;
		}
		this._$observer.observe(target, config);
		if (this.needProgressBar) {
			if (this.progressBarType === 0)
				this._$changePercent(this._$convertLoadingDataSizeToPercent());
			else if (this.progressBarType === 1) {
				this.loadingTime = 0;
				this._$setTimeout();
			}
		}
	}

	_$convertLoadingDataSizeToPercent() {
		let percent = this.loadingDataSize * 100 / this.dataSize;
		percent = Math.round(percent);
		return percent;
	}

	_$changePercent(value) {
		if (value > 100 || !this.needProgressBar || !this.show || this.progressBarType !== 0) return;
		let percent = value;
		this.divChilds[0].innerText = percent + "%";
		if (percent == 100) {
			for (let i = this.oldPercent / 5 - (this.oldPercent / 5) % 1; i <= percent / 5; i++) {
				if (i != 0) {
					if (i % 2 == 0) this.divChilds[i].style.setProperty("border-bottom-color", this.colorDots);
					else this.divChilds[i].style.setProperty("border-top-color", this.colorDots);
				}
			}
			this.divChilds[20].style.setProperty("border-bottom-color", this.colorDots);
			this.oldPercent = percent;
		} else if (percent !== this.oldPercent) {
			for (let i = this.oldPercent / 5 - (this.oldPercent / 5) % 1; i <= percent / 5; i++) {
				if (i != 0) {
					if (i % 2 == 0) this.divChilds[i].style.setProperty("border-bottom-color", this.colorDots);
					else this.divChilds[i].style.setProperty("border-top-color", this.colorDots);
				}
			}
			this.oldPercent = percent;
		}

		// if(percent % 5 == 0 && percent != 0) this.divChilds[percent / 5].style.color = colorDots;
		// let deg = 360 * percent / 100;
		// if (this._$progressPieChart != null) this._$progressPieChart.classList.remove("gt-50");
		// if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.clip = null;
		// if (this._$ppcProgress != null) this._$ppcProgress.style.clip = null;
		// if (percent > 50) {
		// 	if (this._$progressPieChart != null) this._$progressPieChart.classList.add("gt-50");
		// 	if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.clip = `rect(0, ${this._$progressPieChart.offsetWidth}px, ${this._$progressPieChart.offsetWidth}px, ${this._$progressPieChart.offsetWidth / 2}px)`;
		// 	if (this._$ppcProgress != null) this._$ppcProgress.style.clip = `rect(0, ${this._$progressPieChart.offsetWidth / 2}px, ${this._$progressPieChart.offsetWidth}px, 0)`;
		// }
		// if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.transform = `rotate(${deg}deg)`;
		// if (this._$ppcSpan != null) this._$ppcSpan.innerText = percent + "%";
	}

	_$setTimeout() {
		if (this.loadingTime > this._loadTime || !this.needProgressBar || !this.show || this.progressBarType !== 1) {
			this.loadingTime = 0;
			return;
		}
		if (!this.flag) {
			this.flag = true;
			this._$setTimeout();
			return;
		}
		let percent = Math.round(this.loadingTime * 100 / this._loadTime);

		let deg = 360 * percent / 100;
		this.divChilds[0].innerText = (this._loadTime - this.loadingTime) + "\tsec.";
		if (percent !== this.oldPercent) {
			for (let i = this.oldPercent / 5 - (this.oldPercent / 5) % 1; i < percent / 5; i++) {
				if (i != 0) {
					if (i % 2 == 0) this.divChilds[i].style.setProperty("border-bottom-color", this.colorDots);
					else this.divChilds[i].style.setProperty("border-top-color", this.colorDots);
					if (percent == 100) this.divChilds[20].style.setProperty("bborder-bottom-color", this.colorDots);
				}
			}
			this.oldPercent = percent;
		}
		// if (this._$progressPieChart != null) this._$progressPieChart.classList.remove("gt-50");
		// if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.clip = null;
		// if (this._$ppcProgress != null) this._$ppcProgress.style.clip = null;
		// if (percent > 50) {
		// 	if (this._$progressPieChart != null) this._$progressPieChart.classList.add("gt-50");
		// 	if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.clip = `rect(0, ${this._$progressPieChart.offsetWidth}px, ${this._$progressPieChart.offsetWidth}px, ${this._$progressPieChart.offsetWidth / 2}px)`;
		// 	if (this._$ppcProgress != null) this._$ppcProgress.style.clip = `rect(0, ${this._$progressPieChart.offsetWidth / 2}px, ${this._$progressPieChart.offsetWidth}px, 0)`;
		// }
		// if (this._$ppcProgressFill != null) this._$ppcProgressFill.style.transform = `rotate(${deg}deg)`;
		// if (this._$ppcSpan != null) this._$ppcSpan.innerText = (this._loadTime - this.loadingTime) + "\nsec.";
		this.loadingTime++;
		setTimeout(() => {
			if (!this.show) {
				this.loadingTime = 0;
				return;
			}
			this._$setTimeout();
		}, 1000);
	}

	_$updateLoaderPos() {
		if (this.parentWidgetHtml == null) return;
		if (this._$loaderHtmlElement == null) return;
		//если он уже есть - копируем в лоадер все настройки парента.
		this._$loaderHtmlElement.style.width = this.parentWidgetHtml.offsetWidth + "px";
		this._$loaderHtmlElement.style.height = this.parentWidgetHtml.offsetHeight + "px";
		let pos = this._$getOffsetPos(this.parentWidgetHtml);
		this._$loaderHtmlElement.style.top = pos.top + "px";
		this._$loaderHtmlElement.style.left = pos.left + "px";
		this._$loaderHtmlElement.style.visibility = this.parentWidgetHtml.style.visibility;
		this._$loaderHtmlElement.style.display = this.parentWidgetHtml.style.display;

		let width = this._$loaderHtmlElement.offsetWidth;
		let height = this._$loaderHtmlElement.offsetHeight - 100;

		// if ((width < 210 || height < 210) && (width > 65 && height > 65)) {
		// 	if (width < height) {
		// 		this.setGeometryHtml(this._$progressPieChart, width - 20 + "px", width - 20 + "px", width - 20 + "px", width - 20 + "px");

		// 		if (this._$progressPieChart.classList.contains("gt-50"))
		// 			this.setPositionHtml(this._$ppcProgress, `calc(50% - ${(width - 20) / 2}px)`, `calc(50% - ${(width - 20) / 2}px)`, true, `rect(0, ${(width - 20) / 2}px, ${width - 20}px, 0)`);
		// 		else this.setPositionHtml(this._$ppcProgress, `calc(50% - ${(width - 20) / 2}px)`, `calc(50% - ${(width - 20) / 2}px)`, true, `rect(0, ${width - 20}px, ${width - 20}px, ${(width - 20) / 2}px)`);

		// 		this.setGeometryHtml(this._$ppcProgressFill, width - 20 + "px", width - 20 + "px", width - 20 + "px", width - 20 + "px");
		// 		if (this._$progressPieChart.classList.contains("gt-50"))
		// 			this.setPositionHtml(this._$ppcProgressFill, `calc(50% - ${(width - 20) / 2}px)`, `calc(50% - ${(width - 20) / 2}px)`, true, `rect(0, ${width - 20}px, ${width - 20}px, ${(width - 20) / 2}px)`);
		// 		else this.setPositionHtml(this._$ppcProgressFill, `calc(50% - ${(width - 20) / 2}px)`, `calc(50% - ${(width - 20) / 2}px)`, true, `rect(0, ${(width - 20) / 2}px, ${width - 20}px, 0)`);

		// 		this.setGeometryHtml(this._$ppPercent, width - 20 - 16 + "px", width - 20 - 16 + "px", width - 20 - 16 + "px", width - 20 - 16 + "px");
		// 		this.setPositionHtml(this._$ppPercent, `calc(50% - ${(width - 20 - 16) / 2}px)`, `calc(50% - ${(width - 20 - 16) / 2}px)`, false);
		// 		this._$ppcSpan.style.fontSize = ((width - 20 - 16) / 3.5) + "px";
		// 	} else {
		// 		this.setGeometryHtml(this._$progressPieChart, height - 20 + "px", height - 20 + "px", height - 20 + "px", height - 20 + "px");
		// 		if (this._$progressPieChart.classList.contains("gt-50"))
		// 			this.setPositionHtml(this._$ppcProgress, `calc(50% - ${(height - 20) / 2}px)`, `calc(50% - ${(height - 20) / 2}px)`, true, `rect(0, ${(height - 20) / 2}px, ${height - 20}px, 0)`);
		// 		else this.setPositionHtml(this._$ppcProgress, `calc(50% - ${(height - 20) / 2}px)`, `calc(50% - ${(height - 20) / 2}px)`, true, `rect(0, ${height - 20}px, ${height - 20}px, ${(height - 20) / 2}px)`);

		// 		this.setGeometryHtml(this._$ppcProgressFill, height - 20 + "px", height - 20 + "px", height - 20 + "px", height - 20 + "px");
		// 		if (this._$progressPieChart.classList.contains("gt-50"))
		// 			this.setPositionHtml(this._$ppcProgressFill, `calc(50% - ${(height - 20) / 2}px)`, `calc(50% - ${(height - 20) / 2}px)`, true, `rect(0, ${height - 20}px, ${height - 20}px, ${(height - 20) / 2}px)`);
		// 		else tthis.setPositionHtml(this._$ppcProgressFill, `calc(50% - ${(height - 20) / 2}px)`, `calc(50% - ${(height - 20) / 2}px)`, true, `rect(0, ${(height - 20) / 2}px, ${height - 20}px, 0)`);

		// 		this.setGeometryHtml(this._$ppPercent, height - 20 - 16 + "px", height - 20 - 16 + "px", height - 20 - 16 + "px", height - 20 - 16 + "px");
		// 		this.setPositionHtml(this._$ppPercent, `calc(50% - ${(height - 20 - 16) / 2}px)`, `calc(50% - ${(height - 20 - 16) / 2}px)`, false);
		// 		this._$ppcSpan.style.fontSize = ((height - 20 - 16) / 3.5) + "px";
		// 	}
		// }
	}

	setGeometryHtml(element, width, height, minWidth, minHeight) {
		if (!element) {
			return;
		}
		element.style.width = width;
		element.style.height = height;
		element.style.minWidth = minWidth;
		element.style.minHeight = minHeight;
	}

	setPositionHtml(element, top, left, flag, clip) {
		element.style.top = top;
		element.style.left = left;
		if (flag)
			element.style.clip = clip;
	}

	stopLoader() {
		//отключаем наблюдателя
		if (this._$observer != null) {
			this._$observer.disconnect();
		}
		//выкидываем лоадер
		if (this._$loaderHtmlElement != null) {
			this.containerElement.removeChild(this._$loaderHtmlElement);
		}
		this.parentWidget = null;
		this.parentWidgetHtml = null;
		this._$loaderHtmlElement = null;
		this._$loaderInner = null;
		this._$ppcSpan = null;
		this._$ppcProgressFill = null;
		this._$progressPieChart = null;
		delete this._$observer;
	}

	_$getOffsetPos(el) {
		let _x = 0;
		let _y = 0;
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return {
			top: _y,
			left: _x
		};
	}

	_$getRootParent(element) {
		if (element.parentId == -1) return element;
		let parentWidget = Rex.widgets[element.parentId];
		if (parentWidget == null) return element;
		return this._$getRootParent(parentWidget);
	}

	getColorWithoutTransparency(color) {
		let result = "";
		if (color.indexOf("rgb(") !== -1) {
			return color;
		} else if (color.indexOf("rgba(") !== -1) {
			result = "rgb(";
			let tstr = color.replace("rgba(", "");
			tstr = tstr.replace(")", "");
			let arr = tstr.split(",", 4);
			if (arr.length == 4) {
				result += Math.round(arr[0]);
				result += ",";
				result += Math.round(arr[1]);
				result += ",";
				result += Math.round(arr[2]);
				result += ")";
				return result;
			} else {
				console.error("error parse rgba : ", color);
				return "";
			}
		} else if (color.indexOf("#") !== -1) {
			if (color.length === 4 || color.length === 7) return color;
			if (color.length === 9) {
				for (let i = 0; i < 7; ++i) {
					result += color[i];
				}
				return result;
			}
		}

		return color;
	}

	
}
