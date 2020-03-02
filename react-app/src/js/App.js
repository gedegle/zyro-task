import React from 'react';
import axios from 'axios';

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            pageNumber: 1,
            movies: []
        }
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

    render() {
        return(
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Language</th>
                        <th>Release date</th>
                        <th>Popularity</th>
                        <th>IMDB vote</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.movies.length > 0 && this.state.movies.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.language}</td>
                            <td>{item.date}</td>
                            <td>{item.popularity}</td>
                            <td>{item.vote}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default App;