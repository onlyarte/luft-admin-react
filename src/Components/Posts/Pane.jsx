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
    axios.get('http://localhost:3000/posts/')
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
