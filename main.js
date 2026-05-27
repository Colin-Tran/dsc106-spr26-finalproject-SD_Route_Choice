import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

const routes = [
  {
    name: "Santa Fe Depot to Petco Park",
    short: "Santa Fe Depot → Petco",
    color: "#4e79a7",
    crimeDay: 63,
    crimeNight: 58,
    infra: 91,
    walk: 50
  },
  {
    name: "Gaslamp to Convention Center",
    short: "Gaslamp → Convention",
    color: "#f28e2b",
    crimeDay: 42,
    crimeNight: 50,
    infra: 87,
    walk: 50
  },
  {
    name: "Little Italy to Seaport Village",
    short: "Little Italy → Seaport",
    color: "#59a14f",
    crimeDay: 80,
    crimeNight: 78,
    infra: 83,
    walk: 50
  },
  {
    name: "East Village to 12th & Imperial",
    short: "East Village → 12th",
    color: "#b07aa1",
    crimeDay: 64,
    crimeNight: 71,
    infra: 92,
    walk: 50
  },
  {
    name: "Hillcrest to Balboa Park",
    short: "Hillcrest → Balboa",
    color: "#76b7b2",
    crimeDay: 59,
    crimeNight: 74,
    infra: 69,
    walk: 50
  }
];

let selectedRoute = routes[0];
let timeOfDay = "day";
let activeLayer = "distance";

const routeList = d3.select("#route-list");

routeList.selectAll(".route-option")
  .data(routes)
  .join("div")
  .attr("class", d => d.name === selectedRoute.name ? "route-option active" : "route-option")
  .html(d => `
    <span class="route-color" style="background:${d.color}"></span>
    <span>${d.name}</span>
  `)
  .on("click", (event, d) => {
    selectedRoute = d;
    update();
  });

d3.select("#day-btn").on("click", () => {
  timeOfDay = "day";
  d3.select("#day-btn").classed("active", true);
  d3.select("#night-btn").classed("active", false);
  update();
});

d3.select("#night-btn").on("click", () => {
  timeOfDay = "night";
  d3.select("#day-btn").classed("active", false);
  d3.select("#night-btn").classed("active", true);
  update();
});

function getOverall(d) {
  const crime = timeOfDay === "day" ? d.crimeDay : d.crimeNight;
  return Math.round((crime * 0.4) + (d.infra * 0.35) + (d.walk * 0.25));
}

function updateBreakdown() {
  const crime = timeOfDay === "day" ? selectedRoute.crimeDay : selectedRoute.crimeNight;
  const overall = getOverall(selectedRoute);

  const metrics = [
    { label: "Crime Safety", value: crime, color: "#ef4444", risk: crime > 75 ? "Low Risk" : crime > 55 ? "Moderate" : "Elevated" },
    { label: "Infrastructure (lighting + road class)", value: selectedRoute.infra, color: "#f59e0b", risk: "Low Risk" },
    { label: "Walkability (EPA index)", value: selectedRoute.walk, color: "#3b82f6", risk: "Elevated" },
    { label: `Overall (${timeOfDay})`, value: overall, color: "#263247", risk: overall > 75 ? "Low Risk" : overall > 55 ? "Moderate" : "Elevated" }
  ];

  d3.select("#breakdown")
    .html(metrics.map(m => `
      <div class="metric">
        <div class="metric-header">
          <span>${m.label}</span>
          <span>${m.value}</span>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" style="width:${m.value}%; background:${m.color};"></div>
        </div>
        <div class="risk-label">${m.risk}</div>
      </div>
    `).join(""));
}

function drawChart() {
  const container = d3.select("#comparison-chart");
  container.selectAll("*").remove();

  const margin = { top: 28, right: 40, bottom: 80, left: 50 };
  const width = container.node().clientWidth;
  const height = 340;

  const categories = ["Crime (Day)", "Crime (Night)", "Infrastructure", "Walkability"];

  const data = [];
  routes.forEach(route => {
    data.push({ category: "Crime (Day)", route: route.short, value: route.crimeDay, color: route.color, full: route.name });
    data.push({ category: "Crime (Night)", route: route.short, value: route.crimeNight, color: route.color, full: route.name });
    data.push({ category: "Infrastructure", route: route.short, value: route.infra, color: route.color, full: route.name });
    data.push({ category: "Walkability", route: route.short, value: route.walk, color: route.color, full: route.name });
  });

  const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height);

  const x0 = d3.scaleBand()
    .domain(categories)
    .range([margin.left, width - margin.right])
    .paddingInner(0.25);

  const x1 = d3.scaleBand()
    .domain(routes.map(d => d.short))
    .range([0, x0.bandwidth()])
    .padding(0.08);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", margin.left - 38)
    .attr("y", margin.top - 8)
    .attr("font-size", 11)
    .text("Score");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0));

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x0(d.category) + x1(d.route))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => y(0) - y(d.value))
    .attr("fill", d => d.color)
    .attr("opacity", d => d.full === selectedRoute.name ? 0.9 : 0.25);

  svg.append("text")
    .attr("x", x0("Crime (Day)") + 85)
    .attr("y", y(88))
    .attr("font-size", 11)
    .attr("fill", "red")
    .text("39-pt spread across routes");

  const legend = svg.append("g")
    .attr("transform", `translate(${margin.left},${height - 35})`);

  routes.forEach((route, i) => {
    const g = legend.append("g")
      .attr("transform", `translate(${i * 190},0)`);

    g.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", route.color);

    g.append("text")
      .attr("x", 14)
      .attr("y", 9)
      .attr("font-size", 11)
      .text(route.short);
  });
}

// Placeholder functions for scrollytelling steps --> guide audience through the story with narrative text and map layers
function showOnlyRoutes() {
  console.log("Show only route distance");
}

function showCrimeLayer() {
  console.log("Show crime incidents");
}

function showPedestrianLayer() {
  console.log("Show pedestrian density");
}

function showLightingLayer() {
  console.log("Show lighting");
}

function showFinalComparison() {
  console.log("Show final route comparison");
}

function setTimeOfDay(time) {
  timeOfDay = time;

  d3.select("#day-btn").classed("active", timeOfDay === "day");
  d3.select("#night-btn").classed("active", timeOfDay === "night");
}


function updateScrollyStep(step) {
  if (step === 0) {
    activeLayer = "distance";
    setTimeOfDay("day");
  }

  if (step === 1) {
    activeLayer = "crime";
  }

  if (step === 2) {
    activeLayer = "infra";
  }

  if (step === 3) {
    activeLayer = "walk";
    setTimeOfDay("night");
  }

  if (step === 4) {
    activeLayer = "all";
  }

  update();
}


function updateScoreProgress() {
  let score = 50;
  let explanation = "Base route score using distance only.";

  const crime = timeOfDay === "day"
    ? selectedRoute.crimeDay
    : selectedRoute.crimeNight;

  if (activeLayer === "crime") {
    score = Math.round((50 * 0.6) + (crime * 0.4));

    explanation = "Crime density changes the route safety score.";
  }

  if (activeLayer === "infra") {
    score = Math.round(
      (crime * 0.4) +
      (selectedRoute.infra * 0.35) +
      (50 * 0.25)
    );

    explanation = "Infrastructure and lighting improve safety.";
  }

  if (activeLayer === "walk" || activeLayer === "all") {
    score = getOverall(selectedRoute);

    explanation = "Walkability and pedestrian activity complete the final score.";
  }

  d3.select("#score-number")
    .text(score);

  d3.select("#score-bar-fill")
    .style("width", `${score}%`);

  d3.select("#score-explanation")
    .text(explanation);
}

const scroller = scrollama();

scroller
  .setup({
    container: "#scrolly-1",
    step: "#scrolly-1 .step",
    offset: 0.6,
    debug: false
  })

  .onStepEnter(response => {
    const step = +response.element.dataset.step;

    d3.selectAll(".step").classed("active", false);
    d3.select(response.element).classed("active", true);

    updateScrollyStep(step);
  })

  .onStepExit(response => {
    if (response.direction === "up") {
      const step = +response.element.dataset.step - 1;

      if (step >= 0) {
        updateScrollyStep(step);

        d3.selectAll(".step").classed("active", false);

        d3.select(`.step[data-step="${step}"]`)
          .classed("active", true);
      }
    }
  });

window.addEventListener("resize", scroller.resize);

function update() {
  d3.selectAll(".route-option")
    .classed("active", d => d.name === selectedRoute.name);

  updateBreakdown();
  drawChart();
  updateScoreProgress();
}

update();