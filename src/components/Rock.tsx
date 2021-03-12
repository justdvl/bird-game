import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Rock: React.FunctionComponent<{
    x: number;
    y: number;
    index: number;
    w: number;
    color: string;
    sendUp: Function;
    level: number;
    setCountDone: Function;
}> = ({ x, y, index, w, color, sendUp, level, setCountDone }) => {
    const [left, setLeft] = React.useState(0);
    const [die, setDie] = React.useState(false);

    let rockRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (
                rockRef.current &&
                rockRef.current.getBoundingClientRect().left < 100 + w &&
                rockRef.current.getBoundingClientRect().left > 100 - w
            ) {
                sendUp(
                    rockRef.current?.getBoundingClientRect().left,
                    rockRef.current?.getBoundingClientRect().top,
                    w,
                    index
                );
            }

            if (
                rockRef.current &&
                rockRef.current.getBoundingClientRect().left < 0
            ) {
                setCountDone();
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            animate={{ x: -10000 }}
            transition={{
                ease: 'easeOut',
                duration:
                    70 -
                    Math.max(3, level) * 2 * Math.random() -
                    level * 4 * Math.pow(index / (10 + level * 6), 3),
            }}
        >
            <div
                ref={rockRef}
                style={{
                    width: w,
                    height: w,
                    backgroundColor: '#' + color,
                    borderRadius: 25,
                    border: '1px solid',
                    position: 'absolute',
                    left: x,
                    top: y,
                    padding: 10,
                    // backgroundColor: 'black',
                }}
            ></div>
        </motion.div>
    );
};

export default Rock;
