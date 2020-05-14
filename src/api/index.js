import axios from 'axios';

//const url = 'https://covid19.mathdro.id/api';
const url2 = 'https://api.covid19api.com';

export const fetchData = async (country) => {
    let changeableUrl = `${url2}/summary`;
    if (country) {
        changeableUrl = `${url2}/total/dayone/country/${country}`;
    }
    try {
        const APIdata = await axios.get(changeableUrl);
        const len = APIdata.data.length;
        if (len === 0) {
            const date = await axios.get(`${url2}/summary`);
            return {confirmed: 0, recovered: 0, deaths: 0, lastUpdate: date.data.Date}
        }    
        let modifiedData;

        if (country) {
            modifiedData = {
                confirmed: APIdata.data[len-1].Confirmed,
                recovered: APIdata.data[len-1].Recovered,
                deaths: APIdata.data[len-1].Deaths,
                lastUpdate: APIdata.data[len-1].Date,
            }
        }
        else {
            modifiedData = {
                confirmed: APIdata.data.Global.TotalConfirmed,
                recovered: APIdata.data.Global.TotalRecovered,
                deaths: APIdata.data.Global.TotalDeaths,
                lastUpdate: APIdata.data.Date,
            }
            //console.log(modifiedData.lastUpdate);
        }

        return modifiedData;
    } catch(error) {
        console.log(error);
    }
}

export const fetchDailyData =  async (country)=> {
    try {
        if (country) {
            const APIurl = `${url2}/total/dayone/country/${country}`;
            const APIdata = await axios.get(APIurl);
            //const len = APIdata.data.length;
            //console.log(country);

            const modifiedData = APIdata.data.map((dailyData)=>({
                confirmed: dailyData.Confirmed,
                deaths: dailyData.Deaths,
                recovered: dailyData.Recovered,
                date: dailyData.Date.substring(0,10),
            }));

            return modifiedData
        }
        else {
            /*
            const { data } = await axios.get(`${url}/daily`);

            const modifiedData = data.map((dailyData)=>({
                confirmed: dailyData.confirmed.total,
                deaths: dailyData.deaths.total,
                date: dailyData.reportDate,
            }));
            return modifiedData;
            */
            ///*
            let modifiedData = getData();
            const APIurl = `${url2}/summary`;
            const APIdata = await axios.get(APIurl);
            const curDate = APIdata.data.Date.substring(0,10);
            const len = modifiedData.length;
            if (curDate === modifiedData[len-1].date) return modifiedData;
            console.log(curDate);
            const dailyData = {
                confirmed: modifiedData[len-1].confirmed + APIdata.data.Global.NewConfirmed,
                recovered: modifiedData[len-1].recovered + APIdata.data.Global.NewRecovered,
                deaths: modifiedData[len-1].deaths + APIdata.data.Global.NewDeaths,
                date: curDate,
            }
            modifiedData.push(dailyData);
            localStorage.setItem('modifiedData',JSON.stringify(modifiedData));
            return modifiedData;
            //*/
        }
    } catch (error) {
        console.log(error);
    }
}

function getData() {
    var modifiedData = localStorage.getItem('modifiedData');
    if (modifiedData === null) {
        return [];
    }
    else {
        return JSON.parse(modifiedData);
    }
}

export const fetchCountries = async () => {
    try {
        const APIdata = await axios.get(`${url2}/countries`);
        //console.log(APIdata.data.map((country) => [country.Country, country.Slug]));

        return APIdata.data.map((country) => [country.Country, country.Slug]).sort();
        //const { data: { countries}} = await axios.get(`${url}/countries`);
        //return countries.map((country) => country.name);
    } catch (error) {
        console.log(error);
    }
}