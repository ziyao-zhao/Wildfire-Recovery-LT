
/*
Adapted from LT-GEE example workflows and instructor-provided course materials
for GEOG60941 Environmental Remote Sensing.
Modified and extended for an independent Rim Fire case study project.
*/

/*
* ------------------------------------------------------------------------------
* Displaying the Rim Fire perimeter boundary
* ------------------------------------------------------------------------------
*/
Map.addLayer(RimFireBoundary, {palette: '000000'}, 'RimFireBoundary');
Map.centerObject(RimFireBoundary, 10);


/* ------------------------------------------------------------------------------
*  Define parameters for the LandTrendr workflow
*------------------------------------------------------------------------------
*/

//Define Landsat collection parameters
var startYear = 1984; // Start year
var endYear = 2021; // End year
var startDay = '06-10'; // Seasonal window start (MM-DD)
var endDay = '09-20'; // Seasonal window end (MM-DD)
var aoi = RimFireBoundary; // Area of interest based on the fire perimeter
var index = 'NBR'; // Spectral index used for disturbance analysis
var maskThese = ['cloud', 'shadow', 'snow', 'water']; // Elements to mask


//Define change mapping parameters
//checked: false means that the parameter is not applied
var changeParams = {
  delta:  'loss',
  sort:   'greatest',
  year:   { checked: true,  start: 2011, end: 2015 },
  mag:	{ checked: true,  value: 500,  operator: '>', dsnr: false },
  dur:	{ checked: false, value: 4,	operator: '<' },
  preval: { checked: true,  value: 400,  operator: '>' },
  mmu:	{ checked: true,  value: 11 }
};

//Define LandTrendr Segmentation Parameters
var runParams = {
  maxSegments: 6,
  spikeThreshold:0.9,
  vertexCountOvershoot:3,
  preventOneYearRecovery:true,
  recoveryThreshold:0.25,
  pvalThreshold:0.05,
  bestModelProportion:0.75,
  minObservationsNeeded:6
};


//Load the LandTrendr.js module
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js'); 

//Add the selected spectral index to the change parameter object
changeParams.index = index;


// Run Landtrendr
//This automatically builds a Landsat annual image stack for the AOI
var lt = ltgee.runLT(startYear, endYear, startDay, endDay, aoi, index, [], runParams, maskThese);


//Generate the LandTrendr change map layers
var changeImg = ltgee.getChangeMap(lt, changeParams).clip(aoi);
print('Freshly generated LandTrendr output', changeImg);
print('LandTrendr projection', changeImg.projection());


/* ------------------------------------------------------------------------------
* Export the LandTrendr output to a GEE Asset
* ------------------------------------------------------------------------------
* Rendering LandTrendr outputs directly in the map can be slow.
* Exporting the result to an Asset allows faster reloading, visualisation,
* and later analysis.
*/


//Get the spatial referencing of the image prior to export
print("Landsat Projection, crs, and crs_transform:",  changeImg.projection());

Export.image.toAsset({
  image: changeImg, 
  description: 'RimFireimg_LandTrendr_NBR',
  assetId: 'RimFireimg_LandTrendr_output',
  scale: 30,  
  crs: 'EPSG:4326',
  region: aoi
});


/* ------------------------------------------------------------------------------
* Load the exported LandTrendr image from the Assets tab
* ------------------------------------------------------------------------------
* In this workflow, imgRF refers to the imported LandTrendr result image.
*/
print(imgRF, "Details of imported LandTrendr image");

/* ------------------------------------------------------------------------------
* Visualising the outputs
* -----------------------------------------------------------------------------
*/
//Plot some histograms to quickly look at the approx. number of pixels in different  // categories/bins
var magOutputHist =ui.Chart.image.histogram(imgRF
                                  .select('mag')
                                  .multiply(0.001), aoi, 500, 10, 0.1);
var durOutputHist=ui.Chart.image.histogram(imgRF.select('dur'),
                                            aoi, 500, 20, 1);
print(magOutputHist);
print(durOutputHist);

//Palettes
//Library taken from  https://github.com/gee-community/ee-palettes
var palettes = require('users/gena/packages:palettes');
var paletteRamp = palettes.colorbrewer.RdYlBu[7];

//visualisation parameters
var yodVis = {min:2012, max:2016, palette:paletteRamp}; // Colour ramp red - yellow - blue
var magVis = {min:0.3, max:1, palette:paletteRamp}; //Colour ramp red - yellow - blue
var durVis = {min:1, max: 5, palette:paletteRamp}; //Colour ramp red - yellow - blue


//Display the change attribute maps
Map.centerObject(aoi, 10);
Map.addLayer(imgRF.select('mag').multiply(0.001),
              magVis, 'Magnitude of Change'); 
Map.addLayer(imgRF.select('yod'), yodVis, 'Year of Detection');
Map.addLayer(imgRF.select('dur'), durVis, 'Duration of Change');
Map.addLayer(
  imgRF.select('rate'),
  {min: 0, max: 300, palette: ['blue', 'yellow', 'red']},
  'Recovery Rate (NBR)'
);

//Print available bands in the LandTrendr output image
print(imgRF, 'Change image layers');


//Export change data 
// Example single band image
var exportMagImg = imgRF
           .select('mag')
           .multiply(0.001)
           .unmask(0) //Set masked value to 0
           .float(); 

Export.image.toDrive({
  image: exportMagImg, //The name of your image
  description: 'RF_Magnitude_map', 
  folder: 'RF_Output', 
  fileNamePrefix: 'RF_Magnitude_map', 
  region: aoi, 
  scale: 30, 
  maxPixels: 1e13
});

// Export YOD layer
// Set masked values to 0 and export as integer
var exportYodImg = imgRF
           .select(['yod'])
           .unmask(0)
           .short();

Export.image.toDrive({
  image: exportYodImg, //The name of your image
  description: 'RF_YOD_map', 
  folder: 'RF_Output', 
  fileNamePrefix: 'RF_YOD_map', 
  region: aoi, 
  scale: 30, 
  maxPixels: 1e13
});


//export the rate of recovery map
var recoveryRate = imgRF.select('rate');

var hist = ui.Chart.image.histogram({
  image: recoveryRate,
  region: aoi,
  scale: 30,
  maxBuckets: 50
}).setOptions({
  title: 'Histogram of Post-fire Recovery Rate (NBR)',
  hAxis: {title: 'Recovery Rate'},
  vAxis: {title: 'Pixel count'},
  legend: {position: 'none'}
});

print(hist);

Export.image.toDrive({
  image: recoveryRate,
  description: 'RimFire_RecoveryRate_NBR',
  folder: 'GEE_LandTrendr',
  fileNamePrefix: 'RimFire_RecoveryRate_NBR',
  region: aoi,
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});


//load DEM data
var dem = ee.Image("USGS/SRTMGL1_003");

Export.image.toDrive({
  image: dem,
  description: 'RimFire_dem',
  folder: 'GEE_LandTrendr',
  fileNamePrefix: 'RimFire_dem',
  region: aoi,
  scale: 30,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

//generate terrain elevation and slope from DEM
var terrain = ee.Terrain.products(dem);
var elevation = terrain.select('elevation');
var slope = terrain.select('slope');

var analysisImage = ee.Image.cat([
  recoveryRate.rename('rate'),
  slope.rename('slope'),
  elevation.rename('elevation')
]).clip(aoi);


var samples = analysisImage.sample({
  region: aoi,
  scale: 30,
  numPixels: 5000,
  geometries: false
});


//Scatter Plot
var chartSlope = ui.Chart.feature.byFeature(
  samples,
  'slope',
  'rate'
).setOptions({
  title: 'Recovery rate vs slope',
  hAxis: {title: 'Slope (degrees)'},
  vAxis: {title: 'Recovery rate (NBR/year)'},
  pointSize: 2
});
print(chartSlope);


var chartElev = ui.Chart.feature.byFeature(
  samples,
  'elevation',
  'rate'
);
print(chartElev);
