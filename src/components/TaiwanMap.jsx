import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/taiwan/taiwan-counties.json';

export default function TaiwanMap() {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">台灣地圖</h2>
            <ComposableMap projection="geoMercator">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} fill="#DDD" stroke="#333" />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
}
