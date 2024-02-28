import React from "react";
import Image from "next/image";
import close from "../../../public/icons/icon-close.svg";
import arrowDown from "../../../public/icons/icon-arrow-down.svg";
import arrowUp from "../../../public/icons/icon-arrow-up.svg";

export default function Settings({ settings, setSettingsToggle, settingsToggle, updateTimerSettings}) {
  return (
    <div
      className={`${
        settingsToggle ? "block" : "hidden"
      } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[500px] bg-white rounded-[25px]`}
    >
      <div className="flex items-center pt-[34px] px-[40px] justify-between mb-[30px]">
        <span className={`font-bold text-[26px] ${settings.font}`}>
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
        <span
          className={`font-bold text-[13px] tracking-[5px] mb-[26px] inline-block ${settings.font}`}
        >
          TIME (MINUTES)
        </span>
        <form className="flex justify-between mb-6">
          <div>
            <span className="text-[12px] text-blue-300 mb-[10px] inline-block">
              pomodoro
            </span>
            <div className="flex bg-[#EFF1FA] justify-between px-4 pt-4 pb-5 w-[140px] rounded-[10px]">
              <input
                type="number"
                placeholder="25"
                value={settings.pomodoro}
                onChange={(e) => updateTimerSettings({e, setting: "time", type: "pomodoro"})}
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold text-[14px] color-[#1E213F] bg-transparent w-full mr-2 outline-none ${settings.font}`}
              />
              <div className="flex flex-col items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: 1, type: "pomodoro"})}
                  className="w-3 h-1"
                >
                  <Image src={arrowUp} alt="" className="select-none" />
                </button>
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: -1, type: "pomodoro"})}
                  className="w-3 h-1"
                >
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
              <input
                type="number"
                placeholder="5"
                value={settings.shortBreak}
                onChange={(e) => updateTimerSettings({e, setting: "time", type: "shortBreak"})}
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold text-[14px] color-[#1E213F] bg-transparent w-full mr-2 outline-none ${settings.font}`}
              />
              <div className="flex flex-col items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: 1, type: "shortBreak"})}
                  className="w-3 h-1"
                >
                  <Image src={arrowUp} alt="" className="select-none" />
                </button>
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: -1, type: "shortBreak"})}
                  className="w-3 h-1"
                >
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
              <input
                type="number"
                placeholder="15"
                value={settings.longBreak}
                onChange={(e) => updateTimerSettings({e, setting: "time", type: "longBreak"})}
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold text-[14px] color-[#1E213F] bg-transparent w-full mr-2 outline-none ${settings.font}`}
              />
              <div className="flex flex-col items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: 1, type: "longBreak"})}
                  className="w-3 h-1"
                >
                  <Image src={arrowUp} alt="" className="select-none" />
                </button>
                <button
                  type="button"
                  onClick={() => updateTimerSettings({setting: "time", value: -1, type: "longBreak"})}
                  className="w-3 h-1"
                >
                  <Image src={arrowDown} alt="" className="select-none" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="w-full h-[1px] bg-[#161932] opacity-10 mb-7"></div>
        <div className="flex items-center justify-between mb-7">
          <span className="font-bold text-[13px] tracking-[5px]">FONT</span>
          <div className="font-bold text-[15px] flex gap-x-4">
            <button
              onClick={() => updateTimerSettings({setting: "font", font: "font-kumbh-sans"})}
              className={`flex rounded-full w-10 h-10 aspect-square items-center justify-center ${
                settings.font
              } ${
                settings.font === "font-kumbh-sans"
                  ? "bg-[#161932]"
                  : "bg-[#EFF1FA]"
              }`}
            >
              <span
                className={`select-none font-kumbh-sans ${
                  settings.font === "font-kumbh-sans"
                    ? "text-white bg-[#161932]"
                    : "text-[#1E213F] opacity-[0.75]"
                }`}
              >
                Aa
              </span>
            </button>
            <button
              onClick={() => updateTimerSettings({setting: "font", font: "font-roboto-slab"})}
              className={`flex rounded-full w-10 h-10 aspect-square items-center justify-center ${
                settings.font
              } ${
                settings.font === "font-roboto-slab"
                  ? "bg-[#161932]"
                  : "bg-[#EFF1FA]"
              }`}
            >
              <span
                className={`select-none font-roboto-slab ${
                  settings.font === "font-roboto-slab"
                    ? "text-white bg-[#161932]"
                    : "text-[#1E213F] opacity-[0.75]"
                }`}
              >
                Aa
              </span>
            </button>
            <button
              onClick={() => updateTimerSettings({setting: "font", font: "font-space-mono"})}
              className={`flex rounded-full w-10 h-10 aspect-square items-center justify-center ${
                settings.font
              } ${
                settings.font === "font-space-mono"
                  ? "bg-[#161932]"
                  : "bg-[#EFF1FA]"
              }`}
            >
              <span
                className={`select-none font-space-mono ${
                  settings.font === "font-space-mono"
                    ? "text-white bg-[#161932]"
                    : "text-[#1E213F] opacity-[0.75]"
                }`}
              >
                Aa
              </span>
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#161932] opacity-10 mb-7"></div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[13px] tracking-[5px]">COLOR</span>
          <div className="font-bold text-[15px] flex gap-x-4">
            <button
              onClick={() => updateTimerSettings({setting: "color", color: "#F87070"})}
              className="flex rounded-full bg-[#F87070] w-10 h-10 aspect-square items-center justify-center"
            >
              <span className="select-none font-kumbh-sans">
                {settings.color === "#F87070" ? "✓" : ""}
              </span>
            </button>
            <button
              onClick={() => updateTimerSettings({setting: "color", color: "#70F3F8"})}
              className="flex rounded-full bg-[#70F3F8] w-10 h-10 aspect-square items-center justify-center"
            >
              <span className="select-none font-roboto-slab">
                {settings.color === "#70F3F8" ? "✓" : ""}
              </span>
            </button>
            <button
              onClick={() => updateTimerSettings({setting: "color", color: "#D881F8"})}
              className="flex rounded-full bg-[#D881F8] w-10 h-10 aspect-square items-center justify-center"
            >
              <span className="select-none font-space-mono">
                {settings.color === "#D881F8" ? "✓" : ""}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
