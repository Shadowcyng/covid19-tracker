import React, { useState, useEffect }  from 'react';
import './App.css';
import './leaflet.css'


//Components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InfoBox from './components/InfoBox/InfoBox';
import Table from './components/Table/Table';
import Map from './components/Map/Map';
import LineGraph from './components/LineGraph';
import { sortData, prettyPrintState } from './utill/utill'


//Material Ui
import { FormControl, Card, CardContent } from '@material-ui/core';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res=> res.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])

  useEffect(() => {
  //Code inside here will run once when the component load or the variable change if  any in araay not again after
      //async=> send a request, wait for it and do something with input
       const getCountriesData = async () => {
         await fetch("https://disease.sh/v3/covid-19/countries")
         .then(response=> response.json())
         .then(data=>{
           const countries = data.map(country=>(
             {
              name: country.country, //United State, INDIA, UNITED KINGDOM
              value: country.countryInfo.iso2, //UK,USA, IND
             }
           ));
           const sortedData = sortData(data)
           setTableData(sortedData)
           setMapCountries(data);
           setCountries(countries);
         })
       }
       getCountriesData();
    }
  , [])

  const handleCountryChange = async (event) => {
    event.preventDefault();
    const countryCode = event.target.value;
    
    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'  
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`    
    
    await fetch(url)
    .then(res=> res.json())
    .then(data => {
      setCountry(countryCode);
      //Set all of the data from country response
      setCountryInfo(data)
      console.log('data', data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)

    })

    //https://disease.sh/v3/covid-19/countries/all -- for worldwide
    //https://disease.sh/v3/covid-19/countries/{Country_Code} --for country specific

  }
  return (
    <div className="app">
      <div className='app__left'>
        {/* Header */}
        <div className='app__header'>
          {/* Title + Selet Input DropDown Field */}
        <h1>COVID-19 TRACKER</h1>
        <FormControl>
          <Select 
          variant='outlined'
          value={country}
          onChange={handleCountryChange}
          className='app__dropdown'
          >
            {/* Loop through all the countries  and
            show a dropdown list of options */}
              <MenuItem value='worldwide'>Worldwide</MenuItem>
            {
              countries.map((country,index)=> (
              <MenuItem value={country.value} key={index}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </div>
        
        

        {/* InfoBoxs title=Coronavirus cases*/}
        {/* InfoBoxs title=Coronavirus Recoveries */}
        {/* InfoBoxs title=CoronaVirus Deaths */}
        <div className='app__stats'>
          <InfoBox title='Coronavirus Cases' 
          isRed
          active ={casesType === 'cases'}
          onClick = {(e) => setCasesType('cases')}
          cases= {prettyPrintState(countryInfo.todayCases)} 
          total={prettyPrintState(countryInfo.cases)} />
          <InfoBox title='Recoveries'
           active ={casesType === 'recovered'} 
          onClick = {(e) => setCasesType('recovered')}
          cases={prettyPrintState(countryInfo.todayRecovered)} 
          total={prettyPrintState(countryInfo.recovered)} />
          <InfoBox title='Deaths' 
          isRed
          active ={casesType === 'deaths'}
          onClick = {(e) => setCasesType('deaths')}
          cases={prettyPrintState(countryInfo.todayDeaths)} 
          total={prettyPrintState(countryInfo.deaths)} />
        </div>
      {/* MAP */}
      <Map
      casesType={casesType}
      countries={mapCountries} 
      center={mapCenter} 
      zoom={mapZoom}/>
      </div>
      <div className='app__right'>
        <Card className='table-card'>
      <CardContent>
      {/* Table */}
      <h3>Live Cases By Country</h3>
      <Table countries = {tableData} />
      </CardContent>
      </Card>
      <Card>
      <CardContent>
      {/* Graph */}
      <h3 className='app__graphTitle'>Worldwide New Cases</h3>
      <LineGraph  className='app__graph' casesType={casesType} />
      </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default App;
