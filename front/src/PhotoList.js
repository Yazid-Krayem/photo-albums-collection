// front/src/photoList.js
import React from "react";
import { Transition } from "react-spring"; // you can remove this from App.js
import { Link } from "react-router-dom";

const PhotoList = ({ photo_list }) => (
  <Transition
    items={photo_list}
    keys={photo => photo.id}
    from={{ transform: "translate3d(-100px,0,0)" }}
    enter={{ transform: "translate3d(0,0px,0)" }}
    leave={{ transform: "translate3d(-100px,0,0)" }}
  >
    { photo => style => (
      <div style={style}>
        <Link to={"/photo/"+photo.id}>{photo.name}</Link>
      </div>
    )}
  </Transition>
);

export {PhotoList}
