import "./style.css";
import { useState, useEffect } from "react";

const Commercial = ({ commercials }) => {
  const [index, setIndex] = useState(0);
  const [currentCommercial, setCurrentCommercial] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      if (!commercials.length) {
        return;
      }
      const startDate = new Date(commercials[index].frameTime.startDate);
      const endDate = new Date(commercials[index].frameTime.endDate);
      if (startDate.getTime() <= today && today <= endDate.getTime()) {
        setCurrentCommercial(commercials[index]);
      }
      setIndex((index + 1) % commercials.length);

      //+advertisements[index].durationTime
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="container">
      {currentCommercial ? (
        <div className={`template-${currentCommercial.template}`}>
          <h1 className={`title-${currentCommercial.template}`}>
            {currentCommercial.title}
          </h1>
          <div className="images">
            {currentCommercial.images.map((image, i) => {
              return <img key={i} width="100" height="50" alt="" src={image} />;
            })}
          </div>
          <div className={`content-${currentCommercial.template}`}>
            {currentCommercial.content.map((text, i) => {
              return (
                <p key={i} width="100" height="50">
                  {text}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Loading advertisments or no such</p>
      )}
    </div>
  );
};
export default Commercial;
