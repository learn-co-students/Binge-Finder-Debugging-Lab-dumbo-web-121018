import React, { Component } from 'react';
import Adapter from '../Adapter';
import TVShowList from './TVShowList';
import Nav from './Nav';
import SelectedShowContainer from './SelectedShowContainer';
import { Grid } from 'semantic-ui-react';



class App extends Component {
  state = {
    shows: [],
    filteredShows: [],
    searchTerm: "",
    selectedShow: "",
    episodes: [],
    filterByRating: "",
  }

  componentDidMount = () => {
    Adapter.getShows().then(shows => this.setState({shows, filteredShows: shows}))
  }

  componentDidUpdate = () => {
    window.scrollTo(0, 0)
  }

  handleSearch = (e) => {
    this.setState({
      searchTerm: e.target.value.toLowerCase(),
      filteredShows: this.state.shows.filter(show => show.name.toLowerCase().includes(e.target.value.toLowerCase()))
    })
  }

  handleFilter = (e) => {
    e.target.value === "No Filter" ? this.setState({ filterByRating: "" }) : this.setState({ filterByRating: e.target.value})
  }

  selectShow = (show) => {
    this.setState({ selectedShow: show }, () => {
      Adapter.getShowEpisodes(show.id)
      .then((episodes) => this.setState({
        episodes
      }))
    })
  }

  displayShows = () => {
    if (this.state.filterByRating){
      return this.state.filteredShows.filter((s)=> {
        return s.rating.average >= this.state.filterByRating
      })
    } else {
      return this.state.filteredShows
    }
  }

  render (){
    return (
      <div>
        <Nav handleFilter={this.handleFilter} handleSearch={this.handleSearch} searchTerm={this.state.searchTerm}/>
        <Grid celled>
          <Grid.Column width={5}>
            {!!this.state.selectedShow ? <SelectedShowContainer selectedShow={this.state.selectedShow} episodes={this.state.episodes}/> : <div/>}
          </Grid.Column>
          <Grid.Column width={11}>
            <TVShowList shows={this.displayShows()} selectShow={this.selectShow} searchTerm={this.state.searchTerm}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
