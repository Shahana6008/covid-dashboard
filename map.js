

axios.get('https://api.covid19api.com/summary', {
    headers: {
        'X-Access-Token': '5cf9dfd5-3449-485e-b5ae-70a60e997864'
    }
})
    .then(function (response) {
        // handle success
        var covidData = response.data.Countries;
        var G = response.data.Global;
        console.log(response.data.Global);
        
        axios.get('https://raw.githubusercontent.com/eesur/country-codes-lat-long/master/country-codes-lat-long-alpha3.json')
            .then(function (response2) {
                const latLongData = response2.data.ref_country_codes;

                bounds = L.latLngBounds([-90,-180],   [90,180]);

                var mymap = L.map('mapid', {
                    maxBounds: bounds,
                }).setView([12, 70], 2.5);


                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    maxZoom: 8,
                    minZoom: 2.5,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    noWrap:true,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1Ijoic2hhaGFuYS0xNzE4IiwiYSI6ImNrbjJ2MXR3YjFiZWEyb25uNnVscmRtMWYifQ.klNlQ-JBR58R3btiTr8a7w'
                }).addTo(mymap);

                // console.log(covidData);
                // console.log(latLongData);


                for (var i of covidData) {
                    const countryDetail = latLongData.find(function (item) {
                        return item.country === i.Country;
                    });

                    if (!countryDetail) { continue; }

                    var circle = L.circle([countryDetail.latitude, countryDetail.longitude], {
                        color: 'red',
                        fillColor: '#f03',
                        weight: 0,
                        fillOpacity: 0.75,
                        radius: Math.log2(i.TotalConfirmed) * 10000
                    }).addTo(mymap);

                    circle.bindPopup(`${i.Country} <br/>Cases: ${i.TotalConfirmed} <br>Deaths: ${i.TotalDeaths}`);
                }
                
                var totalStatsDiv = document.createElement("div");
                
                totalStatsDiv.className = "total-stats";

                totalStatsDiv.innerHTML = `New Confirmed Cases: ${G.NewConfirmed} <br> Total Confirmed: ${G.TotalConfirmed} <br> New Deaths:: ${G.NewDeaths} <br> Total Deaths: ${G.TotalDeaths} <br> New Recovered: ${G.NewRecovered}  `;

                document.body.appendChild(totalStatsDiv);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })


    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })



// var data = [
//     { lat: 24, long: 54, name: 'UAE', totalCases: 10000, totalDeaths: 5 },
//     { lat: 67, long: 34, name: 'Russia', totalCases: 10000, totalDeaths: 5 },
//     { lat: 34, long: 89, name: 'China', totalCases: 10000, totalDeaths: 5 },
// ]
