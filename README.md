# Exploring Pedestrian Safety and Walkability in Downtown San Diego

DSC 106 Final Project — Spring 2026  
Brian Sun • Colin Tran • Maxime Chung • Christian Kimayong

---

## Project Overview

This project explores how pedestrians experience different walking routes throughout downtown San Diego. Rather than optimizing only for shortest distance, we evaluate routes using a combination of crime density, walkability, lighting coverage, and road infrastructure to better understand how “safe” and “comfortable” different routes may feel during both daytime and nighttime conditions.

Using publicly available datasets and interactive scrollytelling techniques, we visualize how route safety changes as additional contextual factors are introduced throughout the narrative.

The final result is an explorable explanation built with D3.js that allows users to:

- Compare several popular downtown walking routes
- Explore how route safety changes throughout the day
- Understand how different variables contribute to a composite safety score
- Interactively investigate tradeoffs between convenience and perceived pedestrian safety

---

# Narrative Concept

The project follows a chronological “San Diego evening” narrative structure.

As users scroll through the page, the visualization progressively introduces:

1. Route distance / Walkability
2. Crime density
3. Road infrastructure and lighting
4. Nighttime conditions
5. Final route comparisons

This allows users to experience route selection as a realistic urban decision-making process rather than simply viewing static charts or rankings.

---

# Technologies Used

- D3.js
- Mapbox GL JS
- Scrollama
- HTML / CSS / JavaScript
- Python (data preprocessing)
- GeoJSON

---

# Datasets

## Crime Data

San Diego Police Department NIBRS incident data:
- Crime locations
- Crime type
- Timestamp information

Source:  
https://data.sandiego.gov/datasets/police-nibrs/

---

## Lighting Infrastructure

Operational streetlight inventory from the City of San Diego.

Sources:
- https://streets.sandiego.gov
- https://www.arcgis.com/home/item.html?id=b7a9d7e335f34be7b801614f765232c0

---

## Walkability Data

EPA National Walkability Index data used to estimate pedestrian friendliness and urban accessibility.

Source:  
https://www.kaggle.com/datasets/stacey06/u-s-walkability-index

---

## Road Infrastructure

Road geometry and road classification data generated using:
- Mapbox

---

# Route Safety Scoring

Each street segment receives a composite safety score based on four major categories:

```text
Safety Score =
Wcrime × Crime Density
+ Wwalk × Walkability
+ Wlight × Lighting Coverage
+ Wroad × Road Infrastructure
```

Road infrastructure includes:
- Road classification
- Pedestrian suitability
- Major road exposure

The weighting system changes between daytime and nighttime conditions to reflect changing pedestrian priorities after dark.

---

# Routes Analyzed

The project currently evaluates the following downtown San Diego routes:

- Santa Fe Depot → Petco Park
- Gaslamp Quarter → Convention Center
- Little Italy → Seaport Village
- East Village → 12th & Imperial Transit Center
- Hillcrest → Balboa Park

These routes were selected based on:
- tourism popularity
- pedestrian activity
- commuting patterns
- nightlife traffic
- event-based movement (Padres games, conventions, etc.)

---

# Features

## Interactive Scrollytelling
Narrative-driven scrolling experience using Scrollama.

## Dynamic Route Highlighting
Routes update visually based on user selection.

## Day / Night Mode
Visualization and safety scoring dynamically shift between daytime and nighttime conditions.

## Composite Safety Score
Real-time score calculation based on selected route and current safety variables.

## Route Comparison Visualization
Interactive comparison of all routes across multiple safety dimensions.

## Progressive Data Reveal
Additional contextual layers appear as the user scrolls through the narrative.


# Project Structure

```text
project/
│
├── routes.geojson
│── main.js
├── index.html
├── style.css
└── README.md
```

Created for DSC 106 — Data Visualization  
University of California, San Diego  
Spring 2026