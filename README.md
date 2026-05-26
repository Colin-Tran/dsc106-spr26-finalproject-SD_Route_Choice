# dsc106-spr26-finalproject-SD_Route_Choice

# Exploring Pedestrian Safety and Walkability in Downtown San Diego

DSC 106 Final Project — Spring 2026  
Brian Sun, Colin Tran, Maxime Chung, Christian Kimayong

---

## Project Overview

This project is an interactive explorable explanation that analyzes the safety and walkability of several popular pedestrian routes throughout downtown San Diego. Rather than comparing routes only by distance, we explore how factors such as crime, lighting, pedestrian activity, and infrastructure influence the overall pedestrian experience.

The project focuses on helping users understand how different environmental and social factors shape perceptions of pedestrian safety across different locations and times of day.

---

## Core Question

> What actually makes a walking route feel safe?

Our project compares routes using multiple datasets and allows users to explore how changing priorities and conditions affect route safety scores.

---

## Features (in progress / more to come)

- Interactive downtown San Diego route map
- Day vs. night safety comparison
- Route safety breakdown panels
- Route comparison chart
- Toggleable map layers
- Scrollytelling narrative structure
- Interactive route selection
- Composite route safety scoring

---

## Routes Analyzed

- Santa Fe Depot → Petco Park
- Gaslamp Quarter → Convention Center
- Little Italy → Seaport Village
- East Village → 12th & Imperial
- Hillcrest → Balboa Park

---

## Datasets

### Crime Data
- San Diego NIBRS Crime Data (2020–2026)
- Police Calls for Service

Source:
https://data.sandiego.gov/datasets/police-nibrs/

---

### Pedestrian Traffic
- CityIQ Pedestrian Density Data
- Pedestrian Block Activity Data

Sources:
https://data.sandiegodata.org/dataset/sandiegodata-org-pedestrian-blocks/

https://data.sandiegodata.org/dataset/cityiq-io-pedestrians-san-diego/

---

### Lighting / Infrastructure
- San Diego Streetlight Data
- SanGIS / ArcGIS Infrastructure Layers

Sources:
https://streets.sandiego.gov

https://www.arcgis.com/home/item.html?id=b7a9d7e335f34be7b801614f765232c0

---

### Walkability
- EPA National Walkability Index
- Smart Location Database

Source:
https://www.kaggle.com/datasets/stacey06/u-s-walkability-index

---

### Route Geometry
- OpenStreetMap (OSMnx)
- Google Maps / Mapbox Directions APIs

Sources:
https://developers.google.com/maps/documentation/directions

https://www.mapbox.com

---

## Safety Scoring

The project uses a composite safety scoring system inspired by the SafePath methodology.

Each route score combines:
- Crime density
- Pedestrian activity
- Lighting coverage
- Road classification
- Walkability metrics

Separate daytime and nighttime safety scores are computed for each route.

---

## Technologies Used

- HTML
- CSS
- JavaScript
- D3.js
- GeoJSON
- Mapbox GL JS
- Python
- GeoPandas
- OSMnx

---

## Repository Structure

```txt
project-root/
│
├── index.html
├── style.css
├── main.js
│
├── data/
│   ├── routes.geojson
│   ├── crime_cleaned.csv
│   ├── pedestrian_blocks.csv
│   ├── streetlights.geojson
│   └── route_scores.csv
│
├── scripts/
│   ├── clean_crime.py
│   ├── clean_pedestrians.py
│   └── compute_scores.py
│
├── images/
│
└── README.md