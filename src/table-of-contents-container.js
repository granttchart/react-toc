import React, {Component} from "react";
import ReactDOM from "react-dom";

import TableOfContents from "./table-of-contents.js";

export class TableOfContentsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.searchableHeadings = this.props.tocHeadings.toLowerCase().replace(/ /g, '').split(',') || [h1,h2]

    this.state = {
      items: []
    }

    this.buildToc = this.buildToc.bind(this);
  }

  buildToc() {
    //grab the DOM children of this component
    var domNode = ReactDOM.findDOMNode(this);

    if (domNode && domNode.children.length) {
      this.tocList = [];

      //keep track of heading titles and the number of their occurrences
      this.runningList = [];

      for (var i = 0; i < domNode.children.length; i++) {
        var item = domNode.children[i];

        if (item.tagName) {
          var tagType = item.tagName.toLowerCase();

          if (this.searchableHeadings.indexOf(tagType) > -1) {
            //if the element type is in the list of heading tags to search for,
            //add the heading type and its text to an object for insertion into the contents list
            var add = {
              el: tagType,
              contents: item.innerText
            };

            //track the index of a duplicate if one is found, and -1 if this is the first heading with this text
            let isMatchIndex = this.runningList.indexOf(item.innerText);

            //store the number of occurrences of the ID in the +1 array slot from the ID
            let countIndex = isMatchIndex+1;
            this.runningList.push(add.contents);
            this.runningList.push(0);

            //increment the +1 index if this is a duplicate
            if (isMatchIndex > -1) {
              ++this.runningList[countIndex];
            }

            //prepare the ID that we'll add to the header element
            let elementId = item.innerText.replace(/[\,\.\\\/]/g, '').replace(/\s/g, '_');

            if (this.runningList[countIndex] > 0) {
              //append an incremented number to duplicates so every ID is unique
              elementId += '_' + this.runningList[countIndex];
            }

            item.id = elementId;
            add.id = elementId;
            this.tocList.push(add);
          }
        }

        if (domNode.children.length -1 === i) {
          this.setState((prevState) => {
            prevState.items = this.tocList;
            return prevState;
          }, () => {
            ReactDOM.render(<TableOfContents items={this.state.items} />, document.getElementById(this.props.tocList));
          });
        }
      }

    }
  }

  componentDidMount() {
    this.buildToc();
  }

  render() {
    return this.props.children
  }
}
