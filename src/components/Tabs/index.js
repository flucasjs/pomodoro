import React from "react";
import { motion } from "framer-motion";

const TABS = ["pomodoro", "shortBreak", "longBreak"];

export default function Tabs({ selectedTab, onTabClick, colorTheme }) {
  return (
    <div className="mb-12 md:mb-20 lg:mb-24 rounded-[32px] px-[0.375rem] md:px-2 py-2 bg-foreground text-white flex items-center justify-between text-[0.75rem] md:text-[0.875rem] font-bold z-[10]">
      {TABS.map((tab) => (
        <motion.button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`relative py-[18px] px-[22px] md:px-[26px] md:py-4`}
        >
          <span
            className={`${
              tab === selectedTab
                ? "text-background"
                : "text-blue-300 hover:text-[#D7E0FF] text-opacity-40"
            } z-[10] relative transition-[colors_opacity] duration-75 ease-linear delay-75`}
          >
            {tab.replace("Break", " break")}
          </span>
          {tab === selectedTab ? (
            <motion.div
              transition={{ type: "tween", ease: "easeIn", duration: 0.15 }}
              className={`absolute w-full h-full rounded-[28px] text-blue-950 z-0 top-0 left-0 bg-[${colorTheme}]`}
              layoutId="tab"
            />
          ) : null}
        </motion.button>
      ))}
    </div>
  );
}
