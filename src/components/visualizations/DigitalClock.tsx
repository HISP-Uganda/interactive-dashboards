import React, { useState, useEffect } from "react";
import { Stack, Text } from "@chakra-ui/react";
import moment from "moment";

const DigitalClock = () => {
    const [time, setTime] = useState(moment().format("LTS"));
    const [one, setOne] = useState(true);
    const [two, setTwo] = useState(false);
    const [three, setThree] = useState(false);
    const [four, setFour] = useState(false);
    const [cssClass, setCssClass] = useState("");

    const clicked = () => {
        if (one) {
            setCssClass("faded");
            setTimeout(() => {
                setTime(moment().format("l"));
                setOne(false);
                setTwo(true);
                setCssClass("");
            }, 200);
        } else if (two) {
            setCssClass("faded");
            setTimeout(() => {
                setTime(moment().format("MMMM Do YY"));
                setTwo(false);
                setThree(true);
                setCssClass("");
            }, 200);
        } else if (three) {
            setCssClass("faded");
            setTimeout(() => {
                setTime(moment().format("LT"));
                setThree(false);
                setFour(true);
                setCssClass("");
            }, 200);
        } else if (four) {
            setCssClass("faded");
            setTimeout(() => {
                setTime(moment().format("LTS"));
                setFour(false);
                setOne(true);
                setCssClass("");
            }, 200);
        }
    };

    useEffect(() => {
        const intervalID = setInterval(() => {
            if (one) {
                setTime(moment().format("LTS"));
            } else if (four) {
                setTime(moment().format("LT"));
            }
        }, 1000);

        return () => {
            clearInterval(intervalID);
        };
    }, [one, four]);

    return (
        <div id="clock" onClick={clicked}>
            <Text fontSize="2xl" className={cssClass}>
                {time}
            </Text>
        </div>
    );
};

export default DigitalClock;
