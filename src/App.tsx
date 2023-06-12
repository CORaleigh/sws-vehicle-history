
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getVehicles, initView, speedChanged, vehicleSelected } from './utils/map';
import { authenticate } from './utils/auth';
import { CalciteCombobox, CalciteComboboxItem, CalciteSegmentedControl, CalciteSegmentedControlItem } from '@esri/calcite-components-react';


function App() {
  const ref = useRef(null)
  const sliderRef = useRef(null)
  const loaded = useRef(false);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [mapView, setMapView] = useState<__esri.MapView>();
  const speeds = [{value: 100, label: 'Slow'},{value: 50, label: 'Normal'},{value: 10, label: 'Fast'}]
  const [selectedSpeed, setSelectedSpeed] = useState('Normal');
  useEffect(() => {
    if (!loaded.current && ref.current && sliderRef.current) {
      authenticate();
      initView(ref.current, sliderRef.current).then(view => {
        getVehicles().then(data => setVehicles(data));
        setMapView(view);
      });
      
      loaded.current = true;
    }
  }, [])

  return (
    <>
      <div ref={ref}></div>
      <div  id='vehicle-selection'>
      <CalciteCombobox placeholder='Select a vehicle...' selectionMode='single' label={'Select vehicle'}>
        {vehicles.map((vehicle, i) => { return <CalciteComboboxItem key={`vehicle-${i}`} textLabel={vehicle} value={vehicle} 
        onCalciteComboboxItemChange={e => {
          if (e.target.selected) {
            console.log(e.target.value);
            if (mapView) {
              vehicleSelected(e.target.value, mapView);
            }
          }
        }}></CalciteComboboxItem>})}
      </CalciteCombobox>
      <CalciteSegmentedControl onCalciteSegmentedControlChange={e => {
        const selected = speeds.find(speed => speed.label === e.target.value);
        if (selected) {
          setSelectedSpeed(selected.label);
          speedChanged(selected.value);
        }
      }}>
        {speeds.map(speed => <CalciteSegmentedControlItem checked={speed.label === selectedSpeed ? true : undefined} value={speed.label}></CalciteSegmentedControlItem>)}
      </CalciteSegmentedControl>
      </div>
      <div className='slider' ref={sliderRef}></div>
    </>
  )
}

export default App
