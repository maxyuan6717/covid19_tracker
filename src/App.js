import React from 'react';

import {Cards,Chart,CountryPicker} from './components';
import styles from './App.module.css';
import { fetchData } from './api';

import coronaImage from './images/image.png';

class App extends React.Component {
    state = {
        data: {},
        country: '',
    }

    async componentDidMount() {
        const fetchedData = await fetchData();
        document.title = 'COVID-19 Tracker';
        this.setState({data: fetchedData});
    }

    handleCountryChange = async(country) => {
        if (country === 'global') country = null;
        const fetchedData = await fetchData(country);
        
        this.setState({data: fetchedData, country: country});
    }

    render() {
        const {data, country} = this.state;
        if (data === undefined) return null;
        return (
            <div className={styles.container}>
                <img className={styles.image} src = {coronaImage} alt = "COVID-19"/>
                <CountryPicker handleCountryChange={this.handleCountryChange}/>
                <Cards data = {data} />
                <Chart data = {data} country = {country} />
            </div>
        )
    }
}

export default App;