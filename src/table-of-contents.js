import React, {Component} from "react";

export const TableOfContents = (props) => {
  return (
   <ul>
      {props.items.map((item) => {
          return <li className={item.el} key={item.id}><a href={'#'+item.id}>{item.contents}</a></li>
      })}
   </ul>
  );
}
