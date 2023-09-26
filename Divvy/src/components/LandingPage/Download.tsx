import React, { Component } from 'react';
class Download extends Component {

  render() {

    return (
      <div className="App">
        <a href={process.env.PUBLIC_URL + "/litepaper.pdf"} target="_blank">Litepaper</a>
      </div>
    );
  }
}

export default Download;