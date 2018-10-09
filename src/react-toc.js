import React, {Component} from "react";
import ReactDOM from "react-dom";

/*
TODO:
* add scrollspy
*/

const RawHTML = (props) => <span dangerouslySetInnerHTML={{__html: props.html}}></span>;

class TableOfContents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items || []
    }
  }

   render() {
    return (
     <ul>
        {this.state.items.map((item) => {
            return <li className={item.el} key={item.id}><a href={'#'+item.id}>{item.contents}</a></li>
        })}
     </ul>
    );
  }
}

class TableOfContentsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      headings: this.props.tocHeadings.toLowerCase().replace(/ /g, '').split(',') || [h1,h2],
      items: []
    }

    this.buildToc = this.buildToc.bind(this);
  }

  buildToc() {
    //grab the DOM children of this parent component
    var domNode = ReactDOM.findDOMNode(this);
    var tocList = [];

    if (domNode && domNode.children.length) {
      this.childNodes = domNode.children;
      var numberOfChildNodes = domNode.children.length;

      //keep track of heading titles and the number of their occurrences
      this.runningList = [];

      for (var i = 0; i < numberOfChildNodes; i++) {
        var item = domNode.children[i];

        if (item.tagName) {
          var tagType = item.tagName.toLowerCase();

          if (this.state.headings.indexOf(tagType) > -1) {
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
            tocList.push(add);
          }
        }

        if (numberOfChildNodes -1 === i) {
          isRunning = true;
          this.setState((prevState) => {
            console.log('setting items to state');
            prevState.items = tocList;
            return prevState;
          }, () => {
            console.log(this.state);
          });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.items);
    console.log(prevState.items);
    if (!this.state.items.length || this.state.items != prevState.items.length) {
      //content has changed, so rebuild TOC
      console.log('rebuilding TOC');
      this.buildToc();
    }
  }

  componentDidMount() {
    this.buildToc();

    ReactDOM.render(<TableOfContents items={this.state.items} />, document.getElementById(this.props.tocList));
  }

  render = () => this.props.children;
}

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }

    this.buildText = this.buildText.bind(this);
  }

  buildText(array) {
    let text = '';

    array.remaining.sections.forEach((section, index) => {
      text += `<h${section.toclevel}>${section.line}</h${section.toclevel}>`;
      text += section.text;
    });

    this.setState((prevState) => {
      prevState.text = text;

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
          <TableOfContentsContainer tocHeadings="h1, h2, h3" tocList="table-of-contents">
            <RawHTML html={this.state.text} />
          </TableOfContentsContainer>
        </div>
      </main>
    );
  }
}

ReactDOM.render(<Content />, document.getElementById('container'));
