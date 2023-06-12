import MapView from '@arcgis/core/views/MapView.js';
import Map from '@arcgis/core/Map.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
let slider: TimeSlider | undefined = undefined;
export const initView = async (container: HTMLDivElement, sliderContainer: HTMLDivElement) => {
    const map = new Map({
        basemap: {
            portalItem: {
                id: '8d91bd39e873417ea21673e0fee87604'
            }
        }
    });
    const view = new MapView({
        map: map,
        container: container,
        center: [-78.6382,35.7796],
        zoom: 11
    });
    const breadcrumbs = new FeatureLayer({
        portalItem: {
            id: '8d573a0b2e1449d2be987b4c36e909ea'
        },
        id: 'breadcrumbs',
        useViewTime: true,
        effect: "bloom(1.5, 0.5px, 0.1)",
        opacity: 0.8,
        definitionExpression: `VehicleName is null and DateTimeStamp > timestamp'2023-05-31T6:00:00'`,

        renderer: {
            type: 'simple',
            symbol: {
                type: 'simple-marker',
                size: 8,
                color: '#e27728',
                outline: {
                    width: 0,
                    color: '#e27728'
                }
            }
        } as any
    });

   // map.add(vehicles);
    console.log(breadcrumbs)
    map.add(breadcrumbs); 
    const now = new Date();
    const start = new Date().setHours(5);

    slider = new TimeSlider({
        view: view,
        container: sliderContainer, 
        fullTimeExtent: {
            start: start,
            end: now
        },
        disabled: true,
        mode: 'cumulative-from-start',
        timeVisible: true,
        loop: true,
        stops: {
            interval: {
                value: 1,
                unit: 'minutes'
            } as any
        },
        playRate: 50
        
    })
    await view.when();
    return view;
}

export const getVehicles = async (): Promise<string[]> => {
    const layer = new FeatureLayer({
        portalItem: {
            id: 'd8ee2aaaecc248f3bccd395109844546'
        },
        id: 'vehicles-current'
    });
    const result = await layer.queryFeatures({
        where: `datetimestamp >= current_timestamp - 1 and (groupnames like '%Garbage%' or groupnames like '%Recycl%' or groupnames like '%Yard%' or groupnames like '%YW%')`,
        returnDistinctValues: true,
        outFields: ['vehiclename'],
        returnGeometry: false,
        orderByFields: ['vehiclename']
    });
    const vehicles = result.features.map(feature => feature.attributes['vehiclename']);
    return vehicles;
}

export const vehicleSelected = (name: string, view: MapView) => {
    if (slider) {
        slider.disabled = false;
    }
    const layer: FeatureLayer = view.map.findLayerById('breadcrumbs') as __esri.FeatureLayer;
    if (layer) {
        layer.definitionExpression = `VehicleName = '${name}' and DateTimeStamp >= current_timestamp - 1`;
        layer.refresh();
        if (slider) {
            slider.stop();
            layer.visible = false;
            

            setTimeout(() => {
                if (slider) {
                    slider.timeExtent = slider.fullTimeExtent;
                    slider?.play(); 
                    layer.visible = true;

                }
            });
        }
    }
}

export const speedChanged = (value: number) => {
    if (slider) {
        slider.playRate = value;
    }
}