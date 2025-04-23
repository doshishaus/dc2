"use client";

import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Top from "./components/Top";
import Map from "./components/Map";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Stack
        sx={{ bgcolor: "#FBEECD" }}
        justifyContent={"center"}
        alignItems="center"
      >
        {showSplash ? (
          <Stack sx={{ width: "375px", Height: "auto" }}>
            <Top key="splash" />
          </Stack>
        ) : (
          <Stack
            key="main"
            component={motion.div} // メイン画面もアニメーション
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            sx={{ minHeight: "100vh", bgcolor: "primary.light", padding: 1 }}
            width={"100%"}
          >
            <Map />
          </Stack>
        )}
      </Stack>
    </AnimatePresence>
  );
}
