def determinePinColors(station):
    status = station["status"]
    bike_count = station["available_bikes"]

    if status != "OPEN":
        return {'background': "rgba(077, 077, 077)", 'border': "rgba(041, 041, 041)"}
    elif bike_count > 5:
        return {'background': "rgba(046, 209, 138)", 'border': "rgba(019, 115, 051)"}
    elif bike_count > 2:
        return {'background': "rgba(255, 255, 000)", 'border': "rgba(179, 179, 000)"}
    elif bike_count > 0:
        return {'background': "rgba(255, 153, 000)", 'border': "rgba(153, 092, 000)"}
    else:
        return {'background': "rgba(217, 098, 099)", 'border': "rgba(110, 023, 024)"}


def createInfoWindowContent(station):
    available_bikes = station["available_bikes"]
    available_stands = station["available_stands"]
    id = station["id"]
    name = station["name"]
    window_html = f"""
        <div class="max-w-sm"> <!-- Increased the max width for a larger box -->
            <div class="bg-white py-4 px-6 rounded-lg shadow-lg"> <!-- Increased padding for a larger box -->
                <h1 class="text-xl font-semibold mb-4 text-center">{name}</h1> <!-- Made the name bigger, centered, and increased bottom margin -->
                <div class="flex flex-col space-y-2"> <!-- Increased space between items -->
                    <div><span class="font-semibold">Bikes Available:</span> <span class="{"text-red-600" if available_bikes == 0 else "text-gray-600"}">{available_bikes}</span></div>
                    <div><span class="font-semibold">Stands Available:</span> <span class="text-gray-600">{available_stands}</span></div>
                    <div><button onclick="fetchSelectedStation({id})">More Info</button></div>
                </div>
            </div>
        </div>
    """

    return window_html
