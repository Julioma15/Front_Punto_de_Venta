import React from "react";
import circulosMarco from "../../assets/images/circulos-marco.png";
import image4 from "../../assets/images/kiosco-logo.png";
import "../../assets/styles/landingStyles.css";
//import union from "./union.svg";

export const SlideDeCarga = () => {
  return (
    <div className="slide-de-carga">
      <div className="ellipse" />

      <img
        className="circulos-marco"
        alt="Circulos marco"
        src={circulosMarco}
      />

      <div className="text-wrapper">. . .</div>

      <div className="group">
        <img className="image" alt="Image" src={image4} />

        <div className="div">
          

          <div className="text-wrapper-2">TUUDU</div>
        </div>
      </div>
    </div>
  );
};

export default SlideDeCarga
