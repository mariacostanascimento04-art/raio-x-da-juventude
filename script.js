const palette = ["#20b8a7", "#83d9c8", "#b3df76", "#f19a83"];
const fmt = (value, digits = 1) => Number(value).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const svgText = (x, y, text, className = "bar-label", anchor = "start") => `<text class="${className}" x="${x}" y="${y}" text-anchor="${anchor}">${escapeText(text)}</text>`;
const escapeText = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function renderSvg(elementId, contents, label, viewBox = "0 0 760 300") {
	document.getElementById(elementId).innerHTML = `<svg viewBox="${viewBox}" role="img" aria-label="${escapeText(label)}" xmlns="http://www.w3.org/2000/svg">${contents}</svg>`;
}

function renderLineChart(indicator) {
	const width = 760, height = 300, left = 64, right = 34, top = 33, bottom = 244;
	const values = indicator.values, max = 100;
	const x = (index) => left + index * (width - left - right) / (values.length - 1);
	const y = (value) => bottom - value / max * (bottom - top);
	let svg = "";
	[0, 25, 50, 75, 100].forEach((tick) => {
		svg += `<line class="grid-line" x1="${left}" x2="${width - right}" y1="${y(tick)}" y2="${y(tick)}"/>`;
		svg += svgText(left - 12, y(tick) + 4, `${tick}%`, "axis-label", "end");
	});
	const points = values.map((item, index) => `${x(index)},${y(item.value)}`).join(" ");
	svg += `<polyline class="chart-line" points="${points}"/>`;
	values.forEach((item, index) => {
		svg += `<circle class="chart-point" cx="${x(index)}" cy="${y(item.value)}" r="5"/>`;
		svg += svgText(x(index), y(item.value) - 13, `${fmt(item.value)}%`, "chart-area-label", "middle");
		svg += svgText(x(index), bottom + 24, item.year, "axis-label", "middle");
	});
	renderSvg("chart-internet", svg, "Percentual de pessoas com 10 anos ou mais que utilizaram a internet no Brasil, entre 2016 e 2025.");
}

function renderHorizontalBars(elementId, values, labelKey, options = {}) {
	const width = 760, left = options.left ?? 300, right = 58, top = 16, row = options.row ?? 49;
	const height = top + row * values.length + 36;
	const max = options.max ?? Math.ceil(Math.max(...values.map((item) => item.value)) / 10) * 10;
	const plotWidth = width - left - right;
	let svg = "";
	values.forEach((item, index) => {
		const y = top + index * row;
		const barWidth = item.value / max * plotWidth;
		const words = String(item[labelKey]).split(" ");
		const lines = [];
		let line = "";
		words.forEach((word) => {
			if (`${line} ${word}`.trim().length > (options.wrapAt ?? 38) && line) { lines.push(line); line = word; }
			else line = `${line} ${word}`.trim();
		});
		if (line) lines.push(line);
		const lineStart = y + row / 2 - (lines.length - 1) * 7;
		lines.forEach((part, lineIndex) => { svg += svgText(left - 14, lineStart + lineIndex * 14 + 4, part, "bar-label", "end"); });
		svg += `<rect class="chart-bar ${index ? "secondary" : ""}" x="${left}" y="${y + 8}" width="${Math.max(barWidth, 1)}" height="${Math.min(23, row - 13)}" rx="2" style="fill:${palette[index % palette.length]}"/>`;
		svg += svgText(left + barWidth + 8, y + row / 2 + 4, `${fmt(item.value)}%`, "bar-value");
	});
	[0, 25, 50, 75, 100].filter((tick) => tick <= max).forEach((tick) => {
		const tickX = left + tick / max * plotWidth;
		svg += `<line class="grid-line" x1="${tickX}" x2="${tickX}" y1="${top}" y2="${height - 29}"/>`;
		svg += svgText(tickX, height - 7, `${tick}%`, "axis-label", "middle");
	});
	renderSvg(elementId, svg, options.label, `0 0 ${width} ${height}`);
}

function renderStudyYears(indicator) {
	const width = 760, left = 185, right = 44, top = 34, row = 44, height = top + row * indicator.values.length + 42;
	const max = 15, plotWidth = width - left - right;
	let svg = "";
	indicator.values.forEach((item, index) => {
		const y = top + index * row;
		svg += svgText(left - 14, y + 23, item.group, "bar-label", "end");
		["2016", "2024"].forEach((year, series) => {
			const barWidth = item[year] / max * plotWidth;
			const barY = y + 2 + series * 18;
			svg += `<rect x="${left}" y="${barY}" width="${barWidth}" height="13" rx="2" style="fill:${series ? "#20b8a7" : "#b5ddd3"}"/>`;
			svg += svgText(left + barWidth + 6, barY + 11, fmt(item[year]), "bar-value");
		});
	});
	[0, 5, 10, 15].forEach((tick) => {
		const tickX = left + tick / max * plotWidth;
		svg += `<line class="grid-line" x1="${tickX}" x2="${tickX}" y1="${top}" y2="${height - 34}"/>`;
		svg += svgText(tickX, height - 10, `${tick} anos`, "axis-label", "middle");
	});
	svg += `<rect x="${left}" y="8" width="10" height="10" fill="#b5ddd3"/>${svgText(left + 15, 17, "2016", "chart-legend")}`;
	svg += `<rect x="${left + 75}" y="8" width="10" height="10" fill="#20b8a7"/>${svgText(left + 90, 17, "2024", "chart-legend")}`;
	renderSvg("chart-years-study", svg, "Média de anos de estudo entre jovens de 18 a 29 anos por grupo, em 2016 e 2024.", `0 0 ${width} ${height}`);
}

function renderCards(data) {
	const internet = data.indicators.find((item) => item.id === "internet_series");
	const years = data.indicators.find((item) => item.id === "study_years_2016_2024");
	const study = data.indicators.find((item) => item.id === "study_work_2024");
	const broadband = data.indicators.find((item) => item.id === "school_broadband_2024");
	const internetLatest = internet.values.at(-1);
	const incomeGap = years.values.find((item) => item.group === "Maior quartil de renda")["2024"] - years.values.find((item) => item.group === "Menor quartil de renda")["2024"];
	const disengaged = study.values.find((item) => item.group.startsWith("Não ocupados e não estudavam"));
	const schoolGap = Math.max(...broadband.values.map((item) => item.value)) - Math.min(...broadband.values.map((item) => item.value));
	const cards = [
		["INTERNET · BRASIL · 2025", `${fmt(internetLatest.value)}%`, "Pessoas de 10 anos ou mais"],
		["DISTÂNCIA DE RENDA · 2024", `${fmt(incomeGap)} anos`, "Diferença na média de estudo, 18–29 anos"],
		["NÃO OCUPADOS E SEM ESTUDO · 2024", `${fmt(disengaged.value)}%`, "Jovens de 15 a 29 anos; descrição do grupo"],
		["AMPLITUDE ENTRE REDES · 2024", `${fmt(schoolGap)} p.p.`, "Diferença máxima-mínima em banda larga infantil"]
	];
	document.getElementById("metric-cards").innerHTML = cards.map(([label, value, detail]) => `<article class="metric-card"><div class="metric-label">${escapeText(label)}</div><div class="metric-value">${escapeText(value)}</div><div class="metric-detail">${escapeText(detail)}</div></article>`).join("");
}

function renderSources(data) {
	document.getElementById("source-list").innerHTML = data.sources.map((source) => `<article class="source-item"><div><h3>${escapeText(source.institution)} · ${escapeText(source.title)}</h3><p>${escapeText(source.note)}</p></div><a href="${escapeText(source.url)}" target="_blank" rel="noopener noreferrer">Acessar fonte ↗</a></article>`).join("");
	document.querySelectorAll(".chart-source").forEach((element) => {
		const indicator = data.indicators.find((item) => item.id === element.dataset.source);
		const source = data.sources.find((item) => item.id === indicator?.source_id);
		if (!indicator || !source) return;
		element.innerHTML = `<strong>Fonte:</strong> ${escapeText(source.institution)}, ${escapeText(source.title)}. <strong>Unidade:</strong> ${escapeText(indicator.unit)}. <strong>Definição:</strong> ${escapeText(indicator.definition)} <a href="${escapeText(source.url)}" target="_blank" rel="noopener noreferrer">Ver referência ↗</a><br><strong>Limite:</strong> ${escapeText(indicator.limitation)}`;
	});
}

function renderAll(data) {
	const find = (id) => data.indicators.find((indicator) => indicator.id === id);
	renderCards(data);
	renderSources(data);
	renderLineChart(find("internet_series"));
	renderHorizontalBars("chart-study-work", find("study_work_2024").values, "group", { left: 350, row: 57, max: 50, wrapAt: 48, label: "Distribuição percentual de jovens de 15 a 29 anos por situação de estudo e ocupação em 2024." });
	renderStudyYears(find("study_years_2016_2024"));
	renderHorizontalBars("chart-broadband", find("school_broadband_2024").values, "group", { left: 180, row: 54, max: 100, wrapAt: 26, label: "Percentual de escolas de educação infantil com banda larga em 2024 por dependência administrativa." });
	renderHorizontalBars("chart-internet-cuts", find("internet_2025_cuts").values, "group", { left: 220, row: 52, max: 100, wrapAt: 30, label: "Percentual de uso da internet em 2025 por localização e dependência da rede de ensino." });
}

async function loadData() {
	try {
		const response = await fetch("data/indicadores.json");
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		renderAll(await response.json());
	} catch (error) {
		const message = "Não foi possível carregar data/indicadores.json. Abra o site por um servidor local ou publique o repositório no GitHub Pages.";
		document.getElementById("metric-cards").innerHTML = `<p class="loading">${message}</p>`;
		document.getElementById("source-list").innerHTML = `<p class="loading">${message}</p>`;
		console.error("Falha ao carregar os indicadores do relatório:", error);
	}
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav-principal");
menuButton.addEventListener("click", () => {
	const isOpen = menuButton.getAttribute("aria-expanded") === "true";
	menuButton.setAttribute("aria-expanded", String(!isOpen));
	nav.classList.toggle("open", !isOpen);
});
nav.addEventListener("click", (event) => {
	if (event.target.closest("a")) {
		menuButton.setAttribute("aria-expanded", "false");
		nav.classList.remove("open");
	}
});
loadData();
