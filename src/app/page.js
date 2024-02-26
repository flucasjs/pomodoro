"use client";

import React from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import JSConfetti from "js-confetti";
import logo from "../../public/icons/logo.svg";
import gear from "../../public/icons/icon-settings.svg";
import close from "../../public/icons/icon-close.svg";
import arrowDown from "../../public/icons/icon-arrow-down.svg";
import arrowUp from "../../public/icons/icon-arrow-up.svg";

function reducer(state, action) {
  switch (action.type) {
    case "running": {
      return {
        started: true,
        running: true,
        done: false,
        state: "running",
      };
    }
    case "paused": {
      return {
        started: true,
        running: false,
        done: false,
        state: "paused",
      };
    }
    case "waiting": {
      return {
        started: false,
        running: false,
        done: false,
        state: "waiting",
      };
    }
    case "done": {
      return {
        started: true,
        running: false,
        done: true,
        state: "done",
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function initState() {
  return {
    started: false,
    running: false,
    done: false,
    state: "waiting",
  };
}

function setLabel(state) {
  return state === "paused" || state === "waiting"
    ? "START"
    : state === "done"
    ? "RESTART"
    : "PAUSE";
}

export default function Home() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const [t, dispatch] = React.useReducer(reducer, null, initState);
  const [time, setTime] = React.useState(3);
  const [countdown, setCountdown] = React.useState(1500);
  const [d, setD] = React.useState(() => createCirclePath(134, 244));
  const pathLength = useMotionValue(0);
  const [settingsToggle, setSettingsToggle] = React.useState(false);
  const [settings, setSettings] = React.useState({
    pomodoro: "",
    "short break": "",
    "long break": "",
    color: "",
    font: "",
  });
  const tabs = ["pomodoro", "short break", "long break"];
  const timers = React.useMemo(() => ({
    "pomodoro": 1500,
    "short break": 300,
    "long break": 900,
  }), []);
  const [selected, setSelected] = React.useState(tabs[0]);
  const [debounce, setDebounce] = React.useState(false);

  useMotionValueEvent(pathLength, "animationCancel", () => {
    setTime(timers[selected] - pathLength.get() * timers[selected]);
    setCountdown(
      Math.ceil(timers[selected] - pathLength.get() * timers[selected])
    );
  });

  React.useEffect(() => {
    setD(
      createCirclePath(
        ref.current.clientHeight / 2,
        ref.current.clientHeight / 2 - 12
      )
    );
  }, []);

  const launchConfetti = React.useCallback(() => {
    if (selected === "pomodoro") {
      const jsConfetti = new JSConfetti();
      jsConfetti
        .addConfetti({
          confettiColors: ["#f87171"],
          confettiRadius: 6,
          confettiNumber: 300,
        })
        .then(() => jsConfetti.clearCanvas());
    }
  }, [selected]);

  React.useEffect(() => {
    if (t.state === "waiting") {
      setCountdown(timers[selected]);
      setTime(timers[selected]);
    }
  }, [t, selected, timers]);

  React.useEffect(() => {
    let timeoutID = 0;
    let intervalID = 0;

    let delay = (time * 1e3) % 1e3;
    if (t.state === "running") {
      timeoutID = setTimeout(() => {
        tick();
        intervalID = setInterval(tick, 1e3);
      }, delay || 1e3);
    }

    function tick() {
      setCountdown((s) => {
        if (s > 1) {
          return s - 1;
        } else {
          dispatch({type: "done"});
          launchConfetti();
          return 0;
        }
      })
    }

    return () => {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    };
  }, [t, time, launchConfetti]);

  function handleClick() {
    const transition = {
      type: "tween",
      ease: "linear",
      duration: time,
    };

    setDebounce(true);
    setTimeout(() => setDebounce(false), t.state === "done" ? 800 : 100);

    switch (t.state) {
      case "waiting": {
        dispatch({
          type: "running",
        });
        controls.start({
          pathLength: 1,
          transition: transition,
        });
        break;
      }
      case "running": {
        dispatch({
          type: "paused",
        });
        controls.stop();
        break;
      }
      case "paused": {
        dispatch({
          type: "running",
        });
        controls.start({
          pathLength: 1,
          transition: transition,
        });
        break;
      }
      case "done": {
        dispatch({
          type: "waiting",
        });
        controls.start({
          pathLength: 0,
          transition: { ...transition, ease: "circInOut", duration: 0.8 },
        });
        break;
      }
      default: {
        throw new Error("No dispatcher for " + t.state);
      }
    }
  }

  function handleSelected(tab) {
    controls.stop();
    controls.set({pathLength: 0});
    setSelected(tab);
    setCountdown(timers[tab]);
    setTime(timers[tab]);
    dispatch({
      type: "waiting",
    });
  }

  function handleSettingsClick() {}

  return (
    <div className="container flex flex-col items-center pt-8 font-kumbh-sans">
      <div className="w-[137px] h-6 mb-[45px]">
        <Image src={logo} alt="" />
      </div>
      <div className="mb-12 rounded-[32px] px-[6px] py-2 bg-foreground text-white flex items-center justify-between text-[12px] font-bold z-[10]">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => handleSelected(tab)}
            className={`relative py-[18px] px-[22px]`}
          >
            <span
              className={`${
                selected === tab ? "text-background" : "text-blue-300"
              } z-[10] relative transition-colors duration-75 ease-linear delay-75`}
            >
              {tab}
            </span>
            {selected === tab ? (
              <motion.div
                transition={{ type: "tween", ease: "easeIn", duration: 0.15 }}
                className="absolute w-full h-full bg-red-400 rounded-[28px] text-blue-950 z-0 top-0 left-0"
                layoutId="tab"
              />
            ) : null}
          </motion.button>
        ))}
      </div>
      <div className="w-[300px] h-[300px] text-blue-200 rounded-full mb-[79px] p-4 bg-gradient-linear shadow-dark-blue">
        <button
          onClick={handleClick}
          disabled={debounce}
          className="relative flex items-center justify-center w-full h-full rounded-[50%] bg-foreground overflow-clip"
        >
          <div ref={ref} className="absolute w-full h-full rounded-full">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              className="w-full h-full rounded-full select-none"
            >
              <motion.path
                className="stroke-red-400"
                fill="none"
                strokeWidth={7}
                strokeLinecap="round"
                animate={controls}
                style={{ pathLength }}
                d={d}
              />
            </motion.svg>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[80px] font-bold leading-tight mb-3">
              {String(Math.floor(countdown / 60))}:{String(countdown % 60).padStart(2, 0)}
            </div>
            <div className="font-bold text-[14px] tracking-[0.925em] indent-[0.925em]">
              {setLabel(t.state, time)}
            </div>
          </div>
        </button>
      </div>
      <button
        onClick={() => setSettingsToggle((v) => !v)}
        className="w-[27px] h-[28px]"
      >
        <Image src={gear} alt="" className="select-none" />
      </button>
      <div
        className={`${
          settingsToggle ? "block" : "hidden"
        } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[500px] bg-white rounded-[25px]`}
      >
        <div className="flex items-center pt-[34px] px-[40px] justify-between mb-[30px]">
          <span className="font-kumbh-sans font-bold text-[26px]">
            Settings
          </span>
          <button
            onClick={() => setSettingsToggle(false)}
            className="w-4 h-4 pt-1"
          >
            <Image src={close} alt="" className="select-none" />
          </button>
        </div>
        <div className="w-full h-[1px] bg-[#E3E1E1] mb-6"></div>
        <div className="px-[40px]">
          <span className="font-kumbh-sans font-bold text-[13px] tracking-[5px] mb-[26px] inline-block">
            TIME (MINUTES)
          </span>
          <div className="flex justify-between mb-6">
            <div>
              <span className="text-[12px] text-blue-300 mb-[10px] inline-block">
                pomodoro
              </span>
              <div className="flex bg-[#EFF1FA] justify-between px-4 pt-4 pb-5 w-[140px] rounded-[10px]">
                <span className="font-kumbh-sans font-bold text-[14px] color-[#1E213F]">
                  25
                </span>
                <div className="flex flex-col items-center justify-between">
                  <button className="w-3 h-1">
                    <Image src={arrowUp} alt="" className="select-none" />
                  </button>
                  <button className="w-3 h-1">
                    <Image src={arrowDown} alt="" className="select-none" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[12px] text-blue-300 mb-[10px] inline-block">
                short break
              </span>
              <div className="flex bg-[#EFF1FA] justify-between px-4 pt-4 pb-5 w-[140px] rounded-[10px]">
                <span className="font-kumbh-sans font-bold text-[14px] color-[#1E213F]">
                  5
                </span>
                <div className="flex flex-col items-center justify-between">
                  <button className="w-3 h-1">
                    <Image src={arrowUp} alt="" className="select-none" />
                  </button>
                  <button className="w-3 h-1">
                    <Image src={arrowDown} alt="" className="select-none" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[12px] text-blue-300 mb-[10px] inline-block">
                long break
              </span>
              <div className="flex bg-[#EFF1FA] justify-between px-4 pt-4 pb-5 w-[140px] rounded-[10px]">
                <span className="font-kumbh-sans font-bold text-[14px] color-[#1E213F]">
                  15
                </span>
                <div className="flex flex-col items-center justify-between">
                  <button className="w-3 h-1">
                    <Image src={arrowUp} alt="" className="select-none" />
                  </button>
                  <button className="w-3 h-1">
                    <Image src={arrowDown} alt="" className="select-none" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#161932] opacity-10 mb-7"></div>
          <div className="flex items-center justify-between mb-7">
            <span className="font-bold text-[13px] tracking-[5px]">FONT</span>
            <div className="font-bold text-[15px] flex gap-x-4">
              <button className="flex rounded-full bg-[#161932] w-10 h-10 aspect-square items-center justify-center">
                <span className="text-white select-none font-kumbh-sans">
                  Aa
                </span>
              </button>
              <button className="flex rounded-full bg-[#EFF1FA] w-10 h-10 aspect-square items-center justify-center">
                <span className="select-none font-roboto-slab text-[#1E213F] opacity-[0.75]">
                  Aa
                </span>
              </button>
              <button className="flex rounded-full bg-[#EFF1FA] w-10 h-10 aspect-square items-center justify-center">
                <span className="select-none font-space-mono text-[#1E213F] opacity-[0.75]">
                  Aa
                </span>
              </button>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#161932] opacity-10 mb-7"></div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px] tracking-[5px]">COLOR</span>
            <div className="font-bold text-[15px] flex gap-x-4">
              <button className="flex rounded-full bg-[#F87070] w-10 h-10 aspect-square items-center justify-center">
                <span className="select-none font-kumbh-sans">✓</span>
              </button>
              <button className="flex rounded-full bg-[#70F3F8] w-10 h-10 aspect-square items-center justify-center">
                <span className="select-none font-roboto-slab">✓</span>
              </button>
              <button className="flex rounded-full bg-[#D881F8] w-10 h-10 aspect-square items-center justify-center">
                <span className="select-none font-space-mono">✓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function createCirclePath(center, radius) {
  return `
    M ${center}, ${center}
    m 0,-${radius}
    a ${radius},${radius} 0 0,1 0,${radius * 2}
    a ${radius},${radius} 0 0,1 0,-${radius * 2}
  `;
}
