import React from 'react';
import axios from 'axios';
import { IconContext } from "react-icons";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import loadingIcon from "./../images/loading.svg";

const _ = require("underscore");

function NavBar(props) {
    return (
        <div className={"nav-bar-container"}>
            <nav className={"nav-bar"}>
                <div className={"nav-bar__text"}>Show: </div>
                <select onChange={props.handleShowPerPage} className={"nav-bar__selection"}>
                    <option value={"0"}>20</option>
                    <option value={"1"}>All</option>
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
                        <div className={"side-nav__list-wrapper"}>
                            <h2 className = {"side-nav__heading-selection"}> Selection </h2>
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
                    : null }
                </div>
            </aside>
        )
}
class ScrollUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isScrollVisible: false
        };

        this.toggleScrollBtnVisibility = this.toggleScrollBtnVisibility.bind(this);
    }


    toggleScrollBtnVisibility() {
        if (window.pageYOffset > 400) {
            this.setState({
                isScrollVisible: true
            });
        } else {
            this.setState({
                isScrollVisible: false
            });
        }
    }
    componentDidMount() {
        document.addEventListener("scroll", this.toggleScrollBtnVisibility);
    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.toggleScrollBtnVisibility);
    }
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    render() {
        return (
            <div>
            {this.state.isScrollVisible && (<div onClick={() => this.scrollToTop()} className={"scroll-up-arrow"}>
                    <IconContext.Provider
                        value={{ pointerEvents: "none"}}>
                                <span className={"scroll-arrow"}>
                                    <FaChevronUp />
                                </span>
                    </IconContext.Provider>
            </div>)}
            </div>
        )
    }
}
class App extends React.Component {
    constructor() {
        super();

        this.state = {
            pageNumber: 1,
            movies: [],
            showSelection: false,
            appendMovies: false,
            showAll: false,
            btnBackDisabled: true,
            btnForwDisabled: false
        };

        this.compareByDesc.bind(this);
        this.compareByAsc.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.trackScrolling = this.trackScrolling.bind(this);

        this.delayedCallback = _.debounce(this.receiveData, 500);
    }
    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source();
        this.receiveData();
        document.addEventListener('scroll', this.trackScrolling);
    }
    componentWillUnmount() {
        this.axiosCancelSource.cancel('Component unmounted.');
        document.removeEventListener('scroll', this.trackScrolling);
    }
    receiveData() {
        let tempMovieArr = [],
        pNum = this.state.pageNumber;

        if(this.state.appendMovies)
            pNum = this.state.pageNumber + 1;

        const url = "https://api.themoviedb.org/3/discover/tv?api_key=d847b6fbf410655f6b71421e46883b4f&language=en-US&" +
            "sort_by=popularity.desc&page=" + pNum +
            "&timezone=America%2FNew_York&include_null_first_air_dates=false";


        axios.get(url, {cancelToken: this.axiosCancelSource.token}).then(res => {
            res.data.results.forEach((item) => {
                tempMovieArr.push({
                    "id": item.id,
                    "name": item.name,
                    "vote": item.vote_average,
                    "language": item.original_language,
                    "date": item.first_air_date.slice(0, 4),
                    "popularity": item.popularity
                });
            });

            if(this.state.appendMovies)
                tempMovieArr = this.state.movies.concat(tempMovieArr);

            tempMovieArr.filter((item, i) => tempMovieArr.indexOf(item) !== i);

            this.setState({
                movies: tempMovieArr,
                totalPages: res.data.total_pages,
                pageNumber: pNum,
                loading: false
            })

        }).catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            }
        });
    }
    handleShowPerPage() {
        this.setState({
            showAll: !this.state.showAll,
            appendMovies: false,
            pageNumber: 1
        }, function () {
            this.delayedCallback();
        });
    };
    handlePagination(e) {
        e.preventDefault();
        let pNum,
            bBtn,
            fBtn;

        if(e.target.id === "forward-arrow") {
            if(this.state.pageNumber < 500 && this.state.pageNumber > 498)
            {
                fBtn=true;
                bBtn=false;
            }
            pNum = this.state.pageNumber+1;
        } else if(e.target.id === "back-arrow") {
            if(this.state.pageNumber < 3)
                {
                    bBtn = true;
                    fBtn = false;
                }
            pNum = this.state.pageNumber-1;
        } else if(e.target.id === "first-page") {
            {
                pNum = 1;
                bBtn = true;
                fBtn = false;
            }
        } else if(e.target.id === "last-page") {
            {
                pNum = this.state.totalPages;
                fBtn=true;
                bBtn=false;
            }
        } else {
            if(parseInt(e.target.innerText) === 500)
            {
                fBtn=true;
                bBtn=false;
            } else if(parseInt(e.target.innerText) === 1)
            {
                bBtn = true;
                fBtn = false;
            }
            pNum = parseInt(e.target.innerText);
        }

        this.setState({
            pageNumber: pNum,
            btnBackDisabled: bBtn,
            btnForwDisabled: fBtn
        }, function () {
            this.receiveData();
        });

    }
    trackScrolling() {
        if (this.state.showAll)
            if (
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight-10 &&
                window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight
            ) {
                this.setState({
                    appendMovies: true,
                    loading: true
                });
                this.delayedCallback();
            }
    };
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
    sortBy(key, e) {
        e.preventDefault();

        let arrayCopy = [...this.state.movies];
        arrayCopy.sort(this.compareByAsc(key));

        if (JSON.stringify(arrayCopy) === JSON.stringify(this.state.movies))
            arrayCopy.sort(this.compareByDesc(key));

        this.setState({
            movies: arrayCopy,
            selectedSort: e.target.id,
            prevSelSort: this.state.selectedSort
        }, function () {
            this.toggleClasses(this.state.selectedSort,'fa-rotate-180');
            this.removeClasses(this.state.prevSelSort, this.state.selectedSort, 'fa-rotate-180');
        });
    }
    removeClasses(prevSelected, selected, className) {
        let prevClass = document.getElementById(prevSelected);
        if (prevClass) {
            if(prevSelected !== selected)
                prevClass.childNodes[1].childNodes[0].classList.remove(className);
        }
    }
    toggleClasses(selected, className) {
        let target = document.getElementById(selected);
        if(target)
            target.childNodes[1].childNodes[0].classList.toggle(className);
    }
    onRowClick(e) {
        e.preventDefault();
        let rowData = e.target.parentNode.childNodes;

        this.setState({
            selectedName: rowData[1].innerText,
            selectedLang: rowData[2].innerText,
            selectedYear: rowData[3].innerText,
            selectedPop: rowData[4].innerText,
            selectedVote: rowData[5].innerText,
            showSelection: true,
            selected: e.target.parentNode.id,
            prevSelected: this.state.selected
        });
    }

    render() {
        const buttons = [];
        let pNum;
        for(let i=0; i<5; i++) {
            pNum = this.state.pageNumber+i;
            if(this.state.pageNumber+i <= 500 && this.state.pageNumber+i > 0)
                buttons.push(<button
                key={i}
                className={this.state.pageNumber == pNum ?
                    "page-buttons__button page-buttons__button--active" :
                    "page-buttons__button"}
                onClick={this.handlePagination}>{(parseInt(this.state.pageNumber)+i)}
            </button>)}
        return(
            <div className={"content-wrapper"}>
                <ScrollUp />
                <SideNav state={this.state}/>
                <div className={"table-area-container"}>
                    <div className={"table-wrapper"}>
                        <NavBar handleShowPerPage={this.handleShowPerPage.bind(this)} />
                        <table className={"content-table"}>
                            <thead className={"content-table__header"}>
                            <tr>
                                <th id={"id"} className={"content-table__header__cell"}>ID</th>
                                <th id={"name"} className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('name',e)}>Name
                                    <IconContext.Provider
                                        value={{ pointerEvents: "none"}}>
                                <span  className={"icon"}>
                                    <FaChevronDown  />
                                </span>
                                    </IconContext.Provider>
                                </th>
                                <th id={"lang"} className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('language',e)}>Language
                                    <IconContext.Provider
                                        value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                                    </IconContext.Provider>
                                </th>
                                <th id={"date"} className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('date',e)}>Release date
                                    <IconContext.Provider
                                        value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                                    </IconContext.Provider>
                                </th>
                                <th id={"pop"} className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('popularity',e)}>Popularity
                                    <IconContext.Provider
                                        value={{ pointerEvents: "none"}}>
                                <span className={"icon"}>
                                    <FaChevronDown />
                                </span>
                                    </IconContext.Provider>
                                </th>
                                <th id={"vote"} className={"content-table__header__cell icon-arrow"} onClick={(e) => this.sortBy('vote',e)}>IMDb vote
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
                                <tr key={i} id={item.id} className={this.state.selected == item.id ? "content-table__body__row row-on-focus" : "content-table__body__row"} onClick={this.onRowClick}>
                                    <td className={"content-table__body__cell content-table__body__cell--small-number"}>{item.id}</td>
                                    <td className={"content-table__body__cell content-table__body__cell--bold"}>{item.name}</td>
                                    <td className={"content-table__body__cell"}>{item.language}</td>
                                    <td className={"content-table__body__cell"}>{item.date}</td>
                                    <td className={"content-table__body__cell"}>{item.popularity}</td>
                                    <td className={"content-table__body__cell content-table__body__cell--number"}>
                                        <IconContext.Provider
                                            value={{ pointerEvents: "none"}}>
                                <span className={this.state.selected == item.id ? "icon icon--star icon--star--colour-white" : "icon icon--star" }>
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
                    {
                        this.state.loading ?
                            <div className={"loading-icon"}>
                                <img src={loadingIcon} alt={""}/>
                            </div> : null
                    }
                    {
                        !this.state.appendMovies ?
                            <div className={"pagination-wrapper"}>
                                <div className={"page-buttons"}>
                                    <button disabled={this.state.btnBackDisabled} className={"page-buttons__button"}  id={"back-arrow"} onClick={this.handlePagination}>
                                        <IconContext.Provider
                                            value={{ pointerEvents: "none"}}>
                                        <span className={"icon icon--page-arrows"}>
                                            <IoIosArrowBack />
                                        </span>
                                        </IconContext.Provider>
                                    </button>
                                    <button className={"page-buttons__button"} id={"first-page"} onClick={this.handlePagination}>First</button>
                                    {buttons}
                                    <button className={"page-buttons__button"} id={"last-page"} onClick={this.handlePagination}>Last</button>
                                    <button disabled={this.state.btnForwDisabled} className={"page-buttons__button"}  id={"forward-arrow"} onClick={this.handlePagination}>
                                        <IconContext.Provider
                                            value={{ pointerEvents: "none"}}>
                                        <span className={"icon icon--page-arrows"}>
                                            <IoIosArrowForward />
                                        </span>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
        );
    }
}
export default App;