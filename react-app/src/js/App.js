import React from 'react';
import axios from 'axios';

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

    sortBy(key,e) {
        e.preventDefault();

        let arrayCopy = [...this.state.movies];
        arrayCopy.sort(this.compareByAsc(key));

        if(JSON.stringify(arrayCopy)===JSON.stringify(this.state.movies))
            arrayCopy.sort(this.compareByDesc(key));

        this.setState({movies: arrayCopy});
        this.toggleClass(e);
    }

    toggleClass(e) {
        let target;

        //toggles up-arrow class
        if(e.target.childNodes.length > 0)
        {
            e.target.childNodes[1].classList.toggle('fa-chevron-up');
            target = e.target.childNodes[1];
        }
        else {
            e.target.classList.toggle('fa-chevron-up');
            target = e.target;
        }

        //restores remaining arrows to it's default position
        let cellClasses = document.getElementsByClassName('fa-chevron-up');
        if(cellClasses) {
            for (let i = 0; i < cellClasses.length; i++) {
                if (cellClasses[i] !== target)
                    cellClasses[i].classList.remove('fa-chevron-up');
            }
        }
    }
    render() {
        return(
            <div className={"content-wrapper"}>
                <aside className={"side-nav"}>
                    <div>
                        <h1 className={"side-nav__title"}>Tv series</h1>
                        <div>

                        </div>
                    </div>
                </aside>
                <div className={"table-wrapper"}>
                <div className={"nav-bar-container"}>
                    <nav className={"nav-bar"}>
                        <div className={"nav-bar__text"}>Show: </div>
                        <select className={"nav-bar__selection"}>
                            <option value={"0"} className={"nav-bar__selection__option"}>20</option>
                            <option value={"1"} className={"nav-bar__selection__option"}>All</option>
                        </select>
                    </nav>
                </div>
                <table className={"content-table"}>
                    <thead className={"content-table__header"}>
                    <tr>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('name',e)}>Name
                            <i className={"fas fa-chevron-down"}></i></th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('language',e)}>Language
                            <i className={"fas fa-chevron-down"}></i></th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('date',e)}>Release date
                            <i className={"fas fa-chevron-down"}></i></th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('popularity',e)}>Popularity
                            <i className={"fas fa-chevron-down"}></i></th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('vote',e)}>IMDb vote
                            <i className={"fas fa-chevron-down"}></i></th>
                    </tr>
                    </thead>
                    <tbody className={"content-table__body"}>
                    {this.state.movies.length > 0 && this.state.movies.map((item, i) => (
                        <tr key={i} className={"content-table__body__row"}>
                            <td className={"content-table__body__cell content-table__body__cell--bold"}>{item.name}</td>
                            <td className={"content-table__body__cell"}>{item.language}</td>
                            <td className={"content-table__body__cell"}>{item.date}</td>
                            <td className={"content-table__body__cell"}>{item.popularity}</td>
                            <td className={"content-table__body__cell content-table__body__cell--number"}>
                                <i className={"fa fa-star fa-xs "}></i>
                                {item.vote}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}
export default App;