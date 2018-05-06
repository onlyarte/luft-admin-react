import React, { Component } from 'react';
import axios from 'axios';

class Pane extends Component {
  constructor(props) {
    super(props);
    this.loadPosts = this.loadPosts.bind(this);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts() {
    axios.get('https://api-luft-kma.herokuapp.com/posts/')
      .then(({data}) => {
        this.setState({ posts: data });
      });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}
