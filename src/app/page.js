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
import Tabs from "@/components/Tabs";
import Settings from "@/components/Settings";

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
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    color: "#F87070",
    font: "font-kumbh-sans",
  });

  const timers = React.useMemo(
    () => ({
      pomodoro: settings.pomodoro * 60,
      shortBreak: settings.shortBreak * 60,
      longBreak: settings.longBreak * 60,
    }),
    [settings.pomodoro, settings.shortBreak, settings.longBreak]
  );

  const [selectedTab, setSelectedTab] = React.useState("pomodoro");
  const [debounce, setDebounce] = React.useState(false);

  useMotionValueEvent(pathLength, "animationCancel", () => {
    setTime(timers[selectedTab] - pathLength.get() * timers[selectedTab]);
    setCountdown(
      Math.ceil(timers[selectedTab] - pathLength.get() * timers[selectedTab])
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
    if (selectedTab === "pomodoro") {
      const jsConfetti = new JSConfetti();
      jsConfetti
        .addConfetti({
          confettiColors: [settings.color],
          confettiRadius: 6,
          confettiNumber: 300,
        })
        .then(() => jsConfetti.clearCanvas());
    }
  }, [selectedTab, settings.color]);

  React.useEffect(() => {
    if (t.state === "waiting") {
      setCountdown(timers[selectedTab]);
      setTime(timers[selectedTab]);
    }
  }, [t, selectedTab, timers]);

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
          dispatch({ type: "done" });
          launchConfetti();
          return 0;
        }
      });
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
    controls.set({ pathLength: 0 });
    setSelectedTab(tab);
    setCountdown(timers[tab]);
    setTime(timers[tab]);
    dispatch({
      type: "waiting",
    });
  }

  function updateTimerSettings({setting, ...options}) {
    switch (setting) {
      case "time": {
        handleTimeSettings(options);
        break;
      }
      case "font": {
        handleFontSettings(options);
        break;
      }
      case "color": {
        handleColorSettings(options);
        break;
      }
      default: {
        throw new Error("No dispatcher for " + setting);
      }
    }

  }

  function handleTimeSettings({ e, value, type: timerType }) {
    let newTimerValue;

    if (e) {
      const parsedInputValue = parseInt(e.target.value);
      if (!parsedInputValue) {
        return;
      }
      newTimerValue = parsedInputValue;
    }

    setSettings((prev) => {
      newTimerValue ??= Math.max(1, prev[timerType] + value);
      if (selectedTab === timerType) {
        resetWithSettings(newTimerValue);
      }
      return {
        ...prev,
        [timerType]: newTimerValue,
      };
    });
  }

  function handleFontSettings({ font }) {
    if (!font) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      font,
    }));
  }

  function handleColorSettings({ color }) {
    if (!color) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      color,
    }));
  }

  function resetWithSettings(time) {
    controls.stop();
    controls.set({ pathLength: 0 });
    dispatch({ type: "waiting" });
    setTime(time * 60);
    setCountdown(time * 60);
  }

  return (
    <div
      className={`container flex flex-col items-center pt-8 md:pt-12 lg:pt-14 ${settings.font}`}
    >
      <div className="w-[137px] h-6 mb-[45px] md:w-[156] md:h-8">
        <Image src={logo} className="w-full h-full" alt="" />
      </div>
      <Tabs
        selectedTab={selectedTab}
        onTabClick={handleSelected}
        colorTheme={settings.color}
      />
      <div className="w-[300px] h-[300px] md:w-[410px] md:h-[410px] text-blue-200 rounded-full mb-20 p-4 bg-gradient-linear shadow-dark-blue">
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
              {settings.color === "#F87070" ? (
                <motion.path
                  className={`stroke-[#F87070] stroke-[7px] md:stroke-[14px]`}
                  fill="none"
                  strokeLinecap="round"
                  animate={controls}
                  style={{ pathLength }}
                  d={d}
                />
              ) : settings.color === "#70F3F8" ? (
                <motion.path
                  className={`stroke-[#70F3F8] stroke-[7px] md:stroke-[14px]`}
                  fill="none"
                  strokeLinecap="round"
                  animate={controls}
                  style={{ pathLength }}
                  d={d}
                />
              ) : (
                <motion.path
                  className={`stroke-[#D881F8] stroke-[7px] md:stroke-[14px]`}
                  fill="none"
                  strokeLinecap="round"
                  animate={controls}
                  style={{ pathLength }}
                  d={d}
                />
              )}
            </motion.svg>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`text-[5rem] md:text-[6.25rem] text-blue font-bold leading-tight mb-3`}
            >
              {String(Math.floor(countdown / 60))}:
              {String(countdown % 60).padStart(2, 0)}
            </div>
            <div
              className={`font-bold text-[0.875rem] tracking-[0.925em] indent-[0.925em] md:text-base xl:text-[1.125rem] hover:text-[${settings.color}] transition-colors duration-150 z-10`}
            >
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
      <Settings
        settings={settings}
        setSettingsToggle={setSettingsToggle}
        settingsToggle={settingsToggle}
        updateTimerSettings={updateTimerSettings}
      />
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
