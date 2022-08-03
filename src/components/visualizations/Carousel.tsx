import { useState } from "react";
import { Stack } from "@chakra-ui/react";
import useInterval from "react-useinterval";
import { ISection } from "../../interfaces";
import Visualization from "./Visualization";

const Carousel = (section: ISection) => {
  const [index, setIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const increment = () => {
    if (!pause) {
      setIndex((s: number) => (s + 1) % section.visualizations.length);
    }
  };
  useInterval(increment, 1000 * 10);
  return (
    <Stack onClick={() => setPause(!pause)}>
      <Visualization
        key={section.visualizations[index].id}
        visualization={section.visualizations[index]}
      />
    </Stack>
  );
};

export default Carousel;
