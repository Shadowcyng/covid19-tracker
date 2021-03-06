import React from 'react'
import './Map.css'

import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { showDataOnMap } from '../../utill/utill'

const Map = ({countries,casesType,center, zoom}) => {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution = '&copy; <a href="https://osm.org/copyright">OpenStreetMap </a> contributors' />
                {/* Loop theough the countries and draw the circle */}
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
