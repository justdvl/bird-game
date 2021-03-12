import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Rock from './components/Rock';
import Heart from './components/Heart';
import './App.css';
import bird from './img/bird1.png';
import wing from './img/wing1.png';
import dead from './img/dead.png';

let newLevel = null;

export default function App() {
    const [top, setTop] = React.useState(0);
    const [time, setTime] = React.useState(0);
    const [maxTime, setMaxTime] = React.useState(0);
    const [die, setDie] = React.useState(false);
    const [playAgain, setPlayAgain] = React.useState(false);
    const [a, setA] = React.useState([{ y: 100, w: 50, color: '#002255' }]);
    let birdRef = React.useRef<HTMLDivElement>(null);
    const [round, setRound] = React.useState(1);
    const [level, setLevel] = React.useState(1);
    const [roundB, setRoundB] = React.useState(false);
    const [countDone, setCountDone] = React.useState(0);
    const [hearts, setHearts] = React.useState(1);
    const [scaleY, setScaleY] = React.useState(9);

    const createA = (level: number) => {
        console.log('createA', level);
        const ar = [];
        for (let i = 0; i < 10 + level * 5; i++) {
            ar.push({
                y: Math.random() * 480 - 30,
                w: Math.random() * 50 + 10,
                color: Math.floor(Math.random() * 16777215).toString(16),
            });
        }
        setA(ar);
        setRoundB(true);
        setTimeout(() => {
            setRoundB(false);
        }, 1000);
    };

    useEffect(() => {
        createA(level);
    }, []);

    const click = () => {
        jump();
    };

    useEffect(() => {
        // Add event listener
        document.addEventListener('keydown', eventListener);
        document.addEventListener('click', click);

        // Remove event listener on cleanup
        return () => {
            document.removeEventListener('keydown', eventListener);
            document.removeEventListener('click', click);
        };
    }, [die]);

    const eventListener = (event: KeyboardEvent) => {
        console.log('event.keyCode', event.keyCode);

        if (event.keyCode === 38 || event.keyCode === 13) {
            jump();
        }
        if (event.keyCode === 32 && die) {
            fnPlayAgain(hearts === 0 ? 1 : level, false);
        }
    };

    useEffect(() => {
        console.log('Done', countDone, 'level', level, 'hearts', hearts);
        if (countDone === 10 + level * 5) {
            setTimeout(() => {
                if (!die) {
                    setLevel((level) => level + 1);
                    setHearts((hearts) => hearts + 1);
                    fnPlayAgain(level + 1, true);
                } else {
                    // fnPlayAgain(level, true);
                }
            }, 1000);
        }
    }, [countDone, level]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (die) {
                clearInterval();
            }
            // console.log(
            //     'Cycle',
            //     time,
            //     birdRef.current?.getBoundingClientRect().top
            // );

            a.forEach((item, index) => {});

            setTop((top) => Math.min(top + 70 + level / 2, 436));
            if (!die) {
                if (time + 1 > maxTime) {
                    setMaxTime(time + 1);
                    setTime((time) => time + 1);
                } else {
                    setTime((time) => time + 1);
                }
            }
        }, 50);

        return () => clearInterval(interval);
    }, [top, die, maxTime]);

    React.useEffect(() => {
        if (die === true) {
            setHearts((hearts) => hearts - 1);
            setTimeout(() => {
                setPlayAgain(true);
            }, 1000);

            if (hearts === 0) {
                setTime(0);
            } else {
            }
        }
    }, [die]);

    const sendUp = (x: number, y: number, w: number, index: number) => {
        // console.log('rock top,', y, 'w', w, '>', y + w + 20, y);

        // if (birdRef.current) {
        //     console.log(
        //         'bird top',
        //         birdRef.current?.getBoundingClientRect().top + 13
        //     );
        // }

        if (
            birdRef.current &&
            y + w + 25 > birdRef.current.getBoundingClientRect().top + 13 &&
            y - 5 < birdRef.current.getBoundingClientRect().top + 13
        ) {
            setDie(true);
        }
    };

    const fnPlayAgain = (level: number, won: boolean) => {
        if (level === 1) {
            setHearts(1);
            setTime(0);
        } else {
            if (won) {
                // setTime(time => time)
            } else {
                setTime((time) => Math.max(0, time - 300));
            }
        }
        setDie(false);
        setPlayAgain(false);
        setLevel(level);
        setCountDone(0);
        createA(level);
        setRound((round) => round + 1);
    };

    const jump = () => {
        if (!die) {
            setTop((top) => Math.max(top - 500 - level * 5, -50));
            setScaleY(1);
            setTimeout(() => {
                setScaleY(9);
            }, 160);
        }
    };

    return (
        <div
            style={{
                border: die ? '1px solid red' : '1px solid black',
                //  height: 'calc(100vh - 2px)',
                height: 499,
                overflow: 'hidden',
                userSelect: 'none',
                position: 'relative',
            }}
        >
            <div
                style={{
                    backgroundColor: 'yellow',
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: 80,
                    left: '80%',
                }}
            ></div>

            {die && (
                <div
                    style={{
                        position: 'absolute',
                        top: '45%',
                        left: '45%',
                        color: 'red',
                        fontSize: '300%',
                        opacity: 0.5,
                        textAlign: 'center',
                    }}
                >
                    <div> {hearts === 0 ? 'Game over' : 'Auch!'}</div>

                    <div
                        style={{
                            color: 'black',
                            opacity: 0.8,
                            cursor: 'pointer',
                            visibility: playAgain ? 'visible' : 'hidden',
                        }}
                        onClick={() => {
                            fnPlayAgain(hearts === 0 ? 1 : level, false);
                        }}
                    >
                        {hearts === 0 ? 'Play again' : 'Try again'}
                    </div>
                </div>
            )}

            {roundB && (
                <div
                    style={{
                        position: 'absolute',
                        top: '45%',
                        left: '45%',
                        color: 'green',
                        fontSize: '300%',
                        opacity: 0.5,
                        textAlign: 'center',
                    }}
                >
                    Level {level}
                </div>
            )}

            <div
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 80,
                    display: 'flex',
                    color: 'red',
                }}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                    .filter((x) => x < hearts)
                    .map((heart) => (
                        <Heart />
                    ))}
            </div>

            <div style={{ position: 'absolute', top: 5, right: 10 }}>
                {Math.floor(time / 10)} / {Math.floor(maxTime / 10)}
            </div>

            <div style={{ paddingLeft: 100 }}>
                <motion.div
                    animate={{ y: top }}
                    transition={{ ease: 'easeOut', duration: 2 }}
                >
                    <span ref={birdRef}>
                        {die ? (
                            <div style={{ height: 40 }}>
                                <img
                                    width="40"
                                    src={dead}
                                    alt="Dead"
                                    style={{ position: 'absolute', top: 0 }}
                                />
                            </div>
                        ) : (
                            <div style={{ height: 40 }}>
                                <img
                                    width="40"
                                    src={bird}
                                    alt="Bird"
                                    style={{ position: 'absolute', top: 0 }}
                                />
                                <img
                                    width="25"
                                    src={wing}
                                    alt="Wing"
                                    className="wing"
                                    style={{
                                        position: 'absolute',
                                        top: -27 - scaleY * 1.7 + 9 * 1.7,
                                        left: 1,
                                        transform: `scaleY(0.${scaleY})`,
                                    }}
                                />
                            </div>
                        )}
                    </span>
                </motion.div>
            </div>

            <div key={round}>
                {a.map((item, index) => (
                    <Rock
                        x={1800 + index * 100}
                        y={item.y}
                        index={index}
                        w={item.w}
                        color={item.color}
                        sendUp={sendUp}
                        key={index}
                        level={level}
                        setCountDone={() => {
                            setCountDone((countDone) => countDone + 1);
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    backgroundColor: 'limegreen',
                    width: '40%',
                    height: 100,
                    borderRadius: '90%',
                    position: 'absolute',
                    bottom: -50,
                    left: '50%',
                }}
            ></div>
            <div
                style={{
                    backgroundColor: 'green',
                    width: 'calc(90% + 100px)',
                    height: 100,
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: -50,
                    left: 'calc(100px - 45%)',
                }}
            ></div>
            <div
                style={{
                    backgroundColor: 'green',
                    width: '25%',
                    height: 150,
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: -100,
                    left: '80%',
                }}
            ></div>

            {/* <div className={'ufoBottom'}>
                <div className={'ufo'}></div>
            </div> */}
        </div>
    );
}
