import React from 'react';
import axios from 'axios';
import {IoIosArrowDown} from "react-icons/io";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            pageNumber: 1,
            movies: []
        };

        this.compareByDesc.bind(this);
        this.compareByAsc.bind(this);
        this.sortBy.bind(this);
    }

    receiveData() {
        const url = "https://api.themoviedb.org/3/discover/tv?api_key=d847b6fbf410655f6b71421e46883b4f&language=en-US&" +
            "sort_by=popularity.desc&page="+this.state.pageNumber+
            "&timezone=America%2FNew_York&include_null_first_air_dates=false";
        let tempMovieArr = [];
        axios.get(url,{ cancelToken: this.axiosCancelSource.token }).then( res => {
            res.data.results.forEach((item)=>{
                tempMovieArr.push({
                    "name": item.name,
                    "vote": item.vote_average,
                    "language": item.original_language,
                    "date": item.first_air_date.slice(0,4),
                    "popularity": item.popularity
                });
            });
            this.setState({
                movies: tempMovieArr
            })
        }).catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            }
        });
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source();
        this.receiveData();
    }
    componentWillUnmount() {
        this.axiosCancelSource.cancel('Component unmounted.')
    }


    compareByAsc(key) {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }
    compareByDesc(key) {
        return function (a, b) {
            if (a[key] > b[key]) return -1;
            if (a[key] < b[key]) return 1;
            return 0;
        };
    }

    sortBy(key) {
        let arrayCopy = [...this.state.movies];
        arrayCopy.sort(this.compareByAsc(key));
        if(JSON.stringify(arrayCopy)===JSON.stringify(this.state.movies))
            arrayCopy.sort(this.compareByDesc(key));
        this.setState({movies: arrayCopy});
    }

    render() {
        return(
            <div className={"table-container"}>
                <table className={"content-table"}>
                    <thead className={"content-table__header"}>
                    <tr>
                        <th className={"content-table__header__cell"} onClick={() => this.sortBy('name')}>Name <span className={"icon-arrow"}><IoIosArrowDown/></span></th>
                        <th className={"content-table__header__cell"} onClick={() => this.sortBy('language')}>Language</th>
                        <th className={"content-table__header__cell"} onClick={() => this.sortBy('date')}>Release date</th>
                        <th className={"content-table__header__cell"} onClick={() => this.sortBy('popularity')}>Popularity</th>
                        <th className={"content-table__header__cell"} onClick={() => this.sortBy('vote')}>IMDB vote</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.movies.length > 0 && this.state.movies.map((item, i) => (
                        <tr key={i} className={"content-table__row"}>
                            <td className={"content-table__body-cell content-table__body-cell--bold"}>{item.name}</td>
                            <td className={"content-table__body-cell"}>{item.language}</td>
                            <td className={"content-table__body-cell"}>{item.date}</td>
                            <td className={"content-table__body-cell"}>{item.popularity}</td>
                            <td className={"content-table__body-cell content-table__body-cell--star"}>{item.vote}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default App;