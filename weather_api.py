import openmeteo_requests

# Setup the Open-Meteo API client
openmeteo = openmeteo_requests.Client()

# Make sure all required weather variables are listed here
url = "https://api.open-meteo.com/v1/forecast"
params = {
	"latitude": 53.35, #Dublin lat
	"longitude": 6.26, #Dublin lng
	"current": ["temperature_2m", "precipitation", "wind_speed_10m"]
}
api_request = openmeteo.weather_api(url, params=params)
response = api_request[0]

# Current values
current = response.Current()
current_temperature = current.Variables(0).Value()
current_precipitation = current.Variables(1).Value()
current_wind_speed = current.Variables(2).Value()

print(f"Current time {current.Time()}")
print(f"Current temperature {current_temperature}")
print(f"Current precipitation {current_precipitation}")
print(f"Current wind_speed {current_wind_speed}")