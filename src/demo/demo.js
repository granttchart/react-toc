import React, {Component} from "react";
import ReactDOM from "react-dom";

import TableOfContents from "../table-of-contents.js";
import TableOfContentsContainer from "../table-of-contents-container.js";
import './demo.less';

/*
TODO:
* add scrollspy
*/

const LoadingWidget = () => {
  return (
    <div className="loading">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M288 39.06V55.7a24 24 0 0 0 17.69 23.07C383.2 100.43 440 171.52 440 256c0 101.69-82.3 184-184 184-101.69 0-184-82.3-184-184 0-84.47 56.79-155.56 134.31-177.22A24.01 24.01 0 0 0 224 55.71V39.06a24.02 24.02 0 0 0-30.05-23.23C86.6 43.48 7.4 141.21 8 257.33 8.72 394.38 119.48 504.3 256.53 504 393.26 503.7 504 392.79 504 256c0-115.63-79.14-212.78-186.21-240.24-15.11-3.87-29.79 7.7-29.79 23.3z"/>
      </svg>
    </div>
  );
}

const RawHTML = (props) => <span dangerouslySetInnerHTML={{__html: props.html}}></span>;

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: true
    }

    this.buildText = this.buildText.bind(this);
  }

  buildText(wikipediaText) {
    let text = `
      <h1 className="page-title">${wikipediaText.lead.displaytitle}</h1>
      <p><em>From Wikipedia, the free encylopedia.</em></p>
    `;

    wikipediaText.remaining.sections.forEach((section, index) => {
      text += `<h${section.toclevel}>${section.line}</h${section.toclevel}>`;
      text += section.text;
    });

    this.setState((prevState) => {
      prevState.text = text;
      prevState.loading = false;

      return prevState;
    });
  }

  componentDidMount() {
      fetch("https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Rachel_Carson").then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
      }).then((data) => {
        this.buildText(data);
      }).catch((e) => {
        this.setState({
          error: e.message
        });
      });
  }

  render () {
    return (
      <main>
        <div id="table-of-contents"></div>
        <div className="content">
          {this.state.loading ?
            <LoadingWidget /> :
              <TableOfContentsContainer tocHeadings="h1, h2, h3" tocList="table-of-contents">
                <RawHTML html={this.state.text} />
              </TableOfContentsContainer>
          }
        </div>
      </main>
    );
  }
}

ReactDOM.render(<Content />, document.getElementById('container'));
