import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import '../css/weatherapp.css'
import {IoLocationSharp} from 'react-icons/io5'
import Loading from './Loading.jsx'

const API_KEY = "00c4300f529349f393630439232305"


const videoMap = {
  rain: '/assets/videos/rain-weather.mp4',
  clear: '/assets/videos/clear-weather.mp4',
  null: '/assets/videos/null-weather.mp4'
}

const WeatherApp = () => {
    const [location, setLocation] = useState('')
    const [weather, setWheather] = useState(null)
    const [citySuggestions, setCitySuggestions] = useState([])
    const [forecastDays, setforecastDays] = useState(null)
    const [forecastHours, setForecastHours] = useState(null)
    const [background, setBackground] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [satelliteImage, setSatelliteImage] =useState('')

    const setBackgroundByWeather = (condition) => {
      if (condition.includes('rain')) {
        setBackground(videoMap.rain);
      }  else if (condition.includes('clear')) {
        setBackground(videoMap.clear)
      } else {
        setBackground(videoMap.null)
      }
    }


    const ApiWeatherApi = async() => {
        setIsLoading(true);
        try {
            const reponse = await axios.get (
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
            )
            setWheather(reponse.data)
            if(reponse.data && reponse.data.current && reponse.data.current.condition){
              setBackgroundByWeather(reponse.data.current.condition.text)
            }
            if(reponse.data && reponse.data.current && reponse.data.current.satellite) {
              setSatelliteImage(reponse.data.current.satellite)
            } else {
              setSatelliteImage('')
            }
        } catch (error) {
            console.log('No se pudo obetener la base de datosea')
        } finally {
          setIsLoading(false);

        }
    }

    const forecastDay = async() => {
        try {
            const reponse =await axios.get (
                // `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=10&aqi=no&alerts=no`
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no&alerts=no`

                )
            setforecastDays(reponse.data)
        } catch (error) {
            console.error('Error al obtener los datos')
        }
    }


    const forecastHour = async() => {
        try {
            const reponse = await axios.get (
                `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&hours=24&aqi=no&alerts=no`
            )
            setForecastHours(reponse.data)
        } catch (error) {
            console.error('Error al obtener los datos de las horas')
        }
    }



    const handlePressEnter = (e) => {
      if(e.key === 'Enter') {
        handleSubmit(e)
      }

    }


const searchcities = async (searchText) => {
    try {
        const response = await axios.get ( 
            `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${searchText}`
        )
        setCitySuggestions(response.data)
    } catch (error) {
        console.log('Error al buscar ciudades ')
    }
}

const handleSelectCities = (city) => {
    setLocation(city.name)
    setCitySuggestions([])
    ApiWeatherApi();
    forecastDay();
    forecastHour();
}

const handleSubmit = (e) => {
    e.preventDefault();
    ApiWeatherApi();
    forecastDay();
    forecastHour();
}


    return (
      <>
        {isLoading ? (
          <Loading/>
        ):(
      <>
  {!weather ? (
    <section className='container-weatherApp_index'>
        <h1>Search City</h1>
        <div className='container-weather_index'>
          <div className='container-form_index'>
          <form onSubmit={handleSubmit}>
            <div className='container-search_index'>
              <input 
              type="text"
              value={location}
              placeholder='Busca una ubicacion'
              onChange={(e)=> {

                setLocation(e.target.value)
                searchcities(e.target.value)
              }}
              onKeyDown={handlePressEnter}
              required
              autoComplete='off'
              />
              {citySuggestions.length > 0 && (
                <div className='container-cities_suggest_index'>
                  <h5>Sugerencias</h5>
                  {citySuggestions.map((city) => (
                    <li key={city.id} onClick={()=>handleSelectCities(city)}>
                      <IoLocationSharp/> {city.name} {city.country}
                    </li>
                ))}
                </div>
              )}
            </div>
          </form>
          </div>
        </div>
        
    </section>
) : (
  <>
          <section className={`container-weatherApp `}>

    <div className='container-current_weather'>
      <div>
        <h1>{weather.current.temp_c}°C</h1>
      </div>
      <div className='current-weather_details'>
        <p>{weather.location.name}</p>
        <p>{weather.current.condition.text}</p>
      </div>
    </div>

  <div className='container-weather_general'>
    <div className='container-form_search'>
      <form onSubmit={handleSubmit}>
        <div className='container-search'>
          <input
            type='text'
            value={location}
            placeholder='Busca una ubicacion'
            onChange={(e) => {
              setLocation(e.target.value);
              searchcities(e.target.value);
            }}
            required
            autoComplete='off'
          />
          {citySuggestions.length > 0 && (
            <div className='container-cities_suggest'>
              <h5>Sugerencias</h5>
              {citySuggestions.map((city) => (
                <li key={city.id} onClick={() => handleSelectCities(city)}>
                  <IoLocationSharp /> {city.name}, {city.country}
                </li>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
    {forecastHours && (
      <div className='container-forecast_hours'>
        <h5>24 Horas</h5>
        <div className='forecast-hours'>
          {forecastHours.forecast.forecastday[0].hour.map((hour) => (
            <div key={hour.time} className='card_hour'>
              <p>{hour.time.substring(11, 16)}</p>
              <img src={hour.condition.icon} alt='' />
              <p>{hour.temp_c}°C</p>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {
      forecastDays && (
      <div className='container-forecast_days'>
        <h5>Próximos días</h5>
        <div className='forecast-Days'>
          {forecastDays.forecast.forecastday.map((day) => {
            return (
              <div key={day.date} className='card_days'>
                <p>{day.date.split('-')[2]}/23</p>
                <article>
                  <img src={day.day.condition.icon} alt='' />
                  <span>{day.day.condition.text}</span>
                </article>
                <p>{day.day.maxtemp_c} °C</p>
              </div>
            );
          })}
        </div>
      </div>
    )
    }
  </div>
  </section>

  <section className="container-weatherApp_responsive">

   
        <div className="container-currentWeather_responsive">
          <div className='container-form_responsive'>
            <form onSubmit={handleSubmit}>
              <div className='container-search_index'>
                <input 
                type="text"
                value={location}
                placeholder='Busca una ubicacion'
                onChange={(e)=> {

                  setLocation(e.target.value)
                  searchcities(e.target.value)
                }}
                onKeyDown={handlePressEnter}
                required
                autoComplete='off'
                />
                {citySuggestions.length > 0 && (
                  <div className='container-cities_suggest_index'>
                    <h5>Sugerencias</h5>
                    {citySuggestions.map((city) => (
                      <li key={city.id} onClick={()=>handleSelectCities(city)}>
                        <IoLocationSharp/> {city.name} {city.country}
                      </li>
                  ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className='general-weather_current'>
                <p className='location-name'>  {weather.location.name}, {weather.location.country}</p>
                <article>
                  <img src={weather.current.condition.icon} alt="" />
                </article>
                <h4>{weather.current.temp_c}°C</h4>
                <p className='current-condition_text'>{weather.current.condition.text}</p>
                {/* <div className='container-current_extras'> 
                <p>{weather.current.wind_kph}km/h</p>
                <p>{weather.current.precip_mm}mm</p>
                <p>{weather.current.humidity}%</p>
                </div> */}
          </div>
         
        </div>
        { forecastHours && (
        <div className='container-forecastHours_responsive'>
          <h5>24 Horas</h5>
          <div className="forecast-hours_responsive">
            {forecastHours.forecast.forecastday[0].hour.map((hour)=> (
              <div key={hour.time} className='card-hour_responsive'>
                <p>{hour.time.substring(11,16)}</p>
                <img src={hour.condition.icon} alt="" />
                <p>{hour.temp_c}°</p>
              </div>
            ))}
          </div>
        </div>
        )}
        
       

        
        {
          forecastDays && (
        <div className="container-forecastDays_responsive">
          <h5>Proximos tres dias</h5>
          <div className="forecast-days_reponsive">
            {forecastDays.forecast.forecastday.map((day)=> (
              <div key={day.date} className='card-days_responsive'>
                <p>{day.date.split('-')[2]}/23</p>
                <article>
                <img src={day.day.condition.icon} alt="" />
                <span>{day.day.condition.text}</span>                
                </article>
                <p>{day.day.maxtemp_c}°</p>
              </div>
            ))}
          </div>
        </div>
        )}
</section>
  </>
   )}
   </>
     )}

{/* Seccion mobile responsive */}


</>
        )

}

export default WeatherApp