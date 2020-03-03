import React from 'react';
import axios from 'axios';
import { FaChevronDown } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IconContext } from "react-icons";
function NavBar() {
    return (
        <div className={"nav-bar-container"}>
            <nav className={"nav-bar"}>
                <div className={"nav-bar__text"}>Show: </div>
                <select className={"nav-bar__selection"}>
                    <option value={"0"} className={"nav-bar__selection__option"}>20</option>
                    <option value={"1"} className={"nav-bar__selection__option"}>All</option>
                </select>
            </nav>
        </div>
    )
}
function SideNav(props) {
        return (
            <aside className={"side-nav"}>
                <div className={"side-nav__wrapper"}>
                    <h1 className={"side-nav__title"}>Tv series</h1>
                    {props.state.showSelection ?
                        <div>
                        <div className={"side-nav__list-wrapper"}>
                            <ul className={"side-nav__list"}>
                                <li className={"side-nav__list__items"}>{props.state.selectedName}</li>
                                <li className={"side-nav__list__items"}>{props.state.selectedLang}</li>
                                <li className={"side-nav__list__items"}>{props.state.selectedYear}</li>
                                <li className={"side-nav__list__items"}>{props.state.selectedPop}</li>
                                <li className={"side-nav__list__items"}>
                                    <IconContext.Provider
                                        value={{pointerEvents: "none"}}>
                                <span className={"icon icon--star"}>
                                    <FaStar/>
                                </span>
                                    </IconContext.Provider>{props.state.selectedVote}</li>
                            </ul>
                        </div>
                            <h2 className = {"side-nav__heading-selection"}> Selection </h2></div>
                    : null }
                </div>
            </aside>
        )
}
class App extends React.Component {
    constructor() {
        super();

        this.state = {
            pageNumber: 1,
            movies: [],
            showSelection: false
        };

        this.compareByDesc.bind(this);
        this.compareByAsc.bind(this);
        this.sortBy.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
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
        e.target.childNodes[1].childNodes[0].classList.toggle('fa-rotate-180');
        target = e.target.childNodes[1].childNodes[0];

        //restores remaining arrows to it's default position
        let cellClasses = document.getElementsByClassName('fa-rotate-180');
        if(cellClasses) {
            for (let i = 0; i < cellClasses.length; i++) {
                if (cellClasses[i] !== target)
                    cellClasses[i].classList.remove('fa-rotate-180');
            }
        }
    }
    onRowClick(e) {
        e.preventDefault();
        let rowData = e.target.parentNode.childNodes;

        this.setState({
            selectedName: rowData[0].innerText,
            selectedLang: rowData[1].innerText,
            selectedYear: rowData[2].innerText,
            selectedPop: rowData[3].innerText,
            selectedVote: rowData[4].innerText,
            showSelection: true
        })
    }
    render() {
        return(
            <div className={"content-wrapper"}>
                <SideNav state={this.state}/>
                <div className={"table-wrapper"}>
                <NavBar />
                <table className={"content-table"}>
                    <thead className={"content-table__header"}>
                    <tr>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('name',e)}>Name
                            <IconContext.Provider
                                value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                            </IconContext.Provider>
                        </th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('language',e)}>Language
                            <IconContext.Provider
                                value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                            </IconContext.Provider>
                        </th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('date',e)}>Release date
                            <IconContext.Provider
                                value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                            </IconContext.Provider>
                        </th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('popularity',e)}>Popularity
                            <IconContext.Provider
                                value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                            </IconContext.Provider>
                        </th>
                        <th className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('vote',e)}>IMDb vote
                            <IconContext.Provider
                                value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                            </IconContext.Provider>
                        </th>
                    </tr>
                    </thead>
                    <tbody className={"content-table__body"}>
                    {this.state.movies.length > 0 && this.state.movies.map((item, i) => (
                        <tr key={i} className={"content-table__body__row"} onClick={this.onRowClick}>
                            <td className={"content-table__body__cell content-table__body__cell--bold"}>{item.name}</td>
                            <td className={"content-table__body__cell"}>{item.language}</td>
                            <td className={"content-table__body__cell"}>{item.date}</td>
                            <td className={"content-table__body__cell"}>{item.popularity}</td>
                            <td className={"content-table__body__cell content-table__body__cell--number"}>
                                <IconContext.Provider
                                    value={{ pointerEvents: "none"}}>
                                <span className={"icon icon--star"}>
                                    <FaStar />
                                </span>
                                </IconContext.Provider>
                                {item.vote}
                            </td>
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