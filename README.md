# LandTrendr-Based Wildfire Disturbance and Recovery Analysis  
### A Case Study of the 2013 Rim Fire, California

This repository presents a remote sensing workflow for assessing wildfire disturbance and post-fire vegetation recovery using the **LandTrendr** algorithm and multi-temporal **Landsat** imagery in **Google Earth Engine (GEE)**.

The project focuses on the **2013 Rim Fire** in **Stanislaus National Forest, Tuolumne County, California**, and investigates wildfire disturbance timing, burn severity, post-fire recovery patterns, and the relationship between recovery and terrain slope.

---

## Project Overview

Wildfire is a major natural disturbance in forest ecosystems, with important implications for vegetation loss, ecosystem services, carbon cycling, and ecological recovery. This project applies the LandTrendr temporal segmentation algorithm to annual Landsat time series in order to:

- detect the main wildfire disturbance event
- extract the Year of Detection (YOD)
- quantify disturbance characteristics such as magnitude, duration, and rate of change
- map spatial patterns of post-fire vegetation recovery
- examine how slope relates to recovery rate

This repository is designed as a portfolio-style GIS and remote sensing project demonstrating time-series analysis, wildfire monitoring, spatial visualization, and basic terrain-based interpretation.

---

## Study Area

The study area covers the Rim Fire burn region in California, USA, within Stanislaus National Forest in Tuolumne County, a fire-prone area characterized by mountainous terrain with strong elevation variation from low hills to mid- and high-elevation landscapes.

## Data

### Remote sensing data
Landsat 5 TM
Landsat 7 ETM+
Landsat 8 OLI

### Tools and Software
Google Earth Engine
LandTrendr
Landsat 5/7/8 Surface Reflectance
DEM
ArcGIS 
Excel / Python（for plot）

### Temporal coverage
1984–2021

### Seasonal compositing window
10 June – 20 September

### Additional data
Digital Elevation Model (DEM)

### Pre-processing
- cloud masking
- shadow masking
- snow masking
- water masking
- annual image compositing
- NBR calculation
  
## Methods

### LandTrendr time-series analysis
The LandTrendr algorithm was used to segment annual Landsat time series and identify disturbance and recovery trajectories.

#### Key parameter settings
**Delta:** `loss`
**Sort:** `greatest`
**Target years:** `2011–2015`
**Magnitude threshold:** `> 500`
**Pre-disturbance value threshold:** `> 400`
**Minimum Mapping Unit (MMU):** `11 pixels`

These settings were used to isolate the most significant wildfire disturbance associated with the Rim Fire and reduce noise from minor spectral fluctuations.

### Recovery analysis
Post-fire recovery was evaluated using LandTrendr-derived **NBR recovery metrics**, with spatial variation mapped across the study area.

## Workflow

### Summary workflow
1. Data acquisition  
2. Pre-processing and annual compositing  
3. NBR calculation  
4. LandTrendr segmentation  
5. Disturbance filtering  
6. Recovery metric extraction  
7. Slope derivation and reclassification  
8. Visualization and interpretation  

## Key Outputs
This project generates the following main outputs:

1. Study area map
2. LandTrendr-fitted NBR trajectory
3. Slope map
4. Year of Detection (YOD) map
5. YOD pixel statistics
6. Burn severity map
7. Recovery rate map
8. Recovery histogram
9. Recovery vs slope box plot
## Results

### Wildfire disturbance timing
The YOD analysis showed a clear clustering of disturbance pixels, with the dominant disturbance year identified as 2014, consistent with the main Rim Fire signal captured by the annual Landsat time series.

### Burn severity
LandTrendr-derived disturbance magnitude was used to classify burn severity. Moderate and high severity patches were concentrated mainly in the central and southern parts of the study area.

### Post-fire recovery
Recovery rates showed strong spatial heterogeneity rather than uniform recovery across the burned landscape. Most pixels were concentrated in the medium recovery range, with relatively few extreme values.

### Relationship between slope and recovery
Recovery generally declined with increasing slope. Gentle slopes showed higher median recovery rates, while steep slopes showed lower recovery and a narrower value range. At the pixel level, the relationship appeared **weakly negative** rather than strongly deterministic.

## Main Findings

- LandTrendr effectively captured the main wildfire disturbance associated with the Rim Fire.
- Disturbance timing and severity patterns were spatially consistent with known wildfire impacts.
- Post-fire recovery was spatially heterogeneous across the landscape.
-  Slope showed a **weak negative relationship** with recovery rate.
- Terrain may influence recovery, but recovery is likely shaped by multiple interacting factors beyond topography alone.


## Repository Structure

```bash
.
├── README.md
├── scripts/
│   ├── gee_landtrendr_rimfire.js
├── data/
│   ├── raw/
│   └── processed/
├── figures/
│   ├── study_area.png
│   ├── workflow.png
│   ├── yod.png
│   ├── burn_severity.png
|   ├── slope.tif
│   ├── recovery_rate.png
│   ├── recovery_histogram.png
│   ├── recovery_slope_boxplot.png
│   └── trajectory.png
└── docs/
    └── report.pdf
```


### References

Cohen, W.B. et al. (2016). Forest disturbance across the conterminous United States from 1985–2012: The emerging dominance of forest decline. Forest Ecology and Management, 360, 242–252. https://doi.org/10.1016/j.foreco.2015.10.042

Kennedy, R.E., Yang, Z. and Cohen, W.B. (2010). Detecting trends in forest disturbance and recovery using yearly Landsat time series: 1. LandTrendr—Temporal segmentation algorithms. Remote Sensing of Environment, 114(12), 2897–2910. https://doi.org/10.1016/j.rse.2010.07.008

### Author

ziyao zhao
MSc GIS, The University of Manchester
