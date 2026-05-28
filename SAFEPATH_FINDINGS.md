# Findings Brief for SafePath Team

**From:** DSC 106 Pedestrian Safety Visualization (Brian, Colin, Maxime, Christian)
**For:** SafePath team (Vanshika, Matthew, Max, Ruhan, Ajay)
**Live prototype:** https://dsc106lastmin.netlify.app
**Branch:** `maxime/scrollytelling-prototype` on Colin-Tran/dsc106-spr26-finalproject-SD_Route_Choice

We built a scrollytelling visualization of pedestrian safety in downtown San Diego using the same data sources you're working with. Here's what we found and what might be useful for SafePath.

---

## 1. The scoring formula we used

```
Safety = Crime_Density * W_crime
       + Walkability   * W_walk
       + Infrastructure * W_infra

Day weights:   W_crime = 0.50,  W_walk = 0.25,  W_infra = 0.25
Night weights: W_crime = 0.45,  W_walk = 0.25,  W_infra = 0.30
```

Crime gets the highest weight because it has by far the most spatial variance. Walkability and lighting are relatively uniform across downtown, so they don't differentiate routes much.

**Recommendation for SafePath:** If your app covers areas beyond downtown (campus, residential neighborhoods), walkability may matter more. But within downtown, crime density drives almost everything. Consider letting users adjust weights based on their comfort level.

---

## 2. Key finding: crime is the only differentiator

| Component | Range across 5 routes | Drives route choice? |
|-----------|----------------------|---------------------|
| Crime (day) | 42 - 80 | Yes. 38-point spread |
| Crime (night) | 50 - 78 | Yes. 28-point spread |
| Lighting | 68 - 93 | No. High everywhere |
| Walkability | 50 - 50 | No. Identical |

The entire 18-point safety gap between the safest and least-safe route is explained by crime density. Lighting and walkability scores cancel out.

**Recommendation for SafePath:** In your weight comparison (Ajay's work), you'll likely find the same pattern. Crime should dominate the scoring formula unless you add features with high spatial variance (foot traffic, road width, visibility).

---

## 3. Day vs. night patterns are not what you'd expect

| Route | Day score | Night score | Change |
|-------|-----------|-------------|--------|
| Gaslamp to Convention Ctr | 55 | 61 | +6 (safer at night) |
| Hillcrest to Balboa Park | 59 | 66 | +7 (safer at night) |
| East Village to 12th & Imperial | 68 | 72 | +5 (safer at night) |
| Santa Fe Depot to Petco Park | 67 | 66 | -1 (stable) |
| Little Italy to Seaport Village | 73 | 72 | -1 (stable) |

3 of 5 routes are **safer at night**. Gaslamp improves because nightlife brings foot traffic. East Village improves because daytime property crime drops off.

**Recommendation for SafePath:** A simple "nighttime = more dangerous" assumption would be wrong for many routes. Your app should compute day and night scores separately and let users toggle, not just apply a blanket night penalty.

---

## 4. Edge score statistics (5,500 street segments)

- **Day:** mean 68.6, std 16.1, range 23-97
- **Night:** mean 70.4, std 14.6, range 25-97
- **Day/night correlation:** 0.788 (strong but not perfect. 21% of variance is unique to time of day)

The distribution is left-skewed: most streets are moderately safe (60-80), but a tail of dangerous segments (below 40) pulls the mean down. These dangerous segments cluster in East Village and the Convention Center corridor.

**Recommendation for SafePath:** A routing algorithm that avoids the bottom quintile (score < 50) would eliminate most dangerous segments without adding much distance.

---

## 5. Pathfinding approach

We implemented Dijkstra's in the browser (JavaScript) with this edge weight:

```
weight = segment_length / max(safety_score, 0.1)
```

This means a segment with score 0.5 is "twice as expensive" to traverse as a segment with score 1.0. A dangerous 100m street costs the same as a safe 200m street. The algorithm naturally finds paths that balance distance and safety.

**Recommendation for SafePath:** If you're using NetworkX in Python, the same weight function works with `nx.shortest_path(G, source, target, weight='cost')`. Precompute the cost for each edge as `length / safety_score`.

---

## 6. Data issues we hit

1. **OSM road network has edges in the water.** Piers, parking structures, and data artifacts extend into San Diego Bay. We clipped to a hand-drawn coastline polygon. You'll want a land boundary mask.

2. **Streetlight coordinates are noisy.** Some lights in the city inventory geocode to the wrong side of the street or to median islands. We used a 30m buffer for "streetlight within range" to absorb this noise.

3. **Crime data has temporal gaps.** NIBRS data from 2020-2021 is lower than 2022-2024, likely due to COVID-era underreporting. We used 2020-2026 in aggregate but consider weighting recent years higher.

4. **EPA Walkability Index is at the block-group level.** It's too coarse for street-level routing. Every block group in downtown gets roughly the same score. If you need walkability to differentiate streets, consider computing your own from OSM amenity density.

---

## 7. What we built that you could reuse

| Component | What it does | Where |
|-----------|-------------|-------|
| Composite scoring formula | Weights crime, walkability, lighting per edge | `downtown_sd.json` (pre-computed) |
| Client-side Dijkstra's | Finds safest path between any two points | `index.html`, search for `dijkstraSafest` |
| Day/night score comparison | Computes "safer alternative" for each route | `index.html`, search for `updateNavAlternative` |
| Coastline clip polygon | Masks water-area data artifacts | `index.html`, search for `COASTLINE` |
| Scrollytelling pattern | Progressive disclosure of data layers | Full `index.html` structure |

The `downtown_sd.json` file (747KB) contains all 5,500 scored edges, 5 routes with waypoints, 1,000 streetlights, 800 crime incidents, and map bounds. It's a self-contained dataset for downtown SD.

---

## 8. Visual design lessons

- **Red-Yellow-Blue diverging scale** (d3.interpolateRdYlBu) works well for safety scores. Red = dangerous, blue = safe. Avoid green/red (colorblind-unfriendly).
- **Night mode matters.** When showing nighttime data, darken the map background. It makes the data feel real and helps users understand the time context.
- **Annotations need neighborhoods.** "73/100" on a map means nothing. "Little Italy: 73 (Low Risk)" is immediately understandable.
- **Show the formula.** Users trust scores more when they can see what goes into them. We show the formula as an overlay on the map.

---

Good luck with the Streamlit app. If any of this is useful or you want the raw data pipeline, reach out.
