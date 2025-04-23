import { Box, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function Top() {
  return (
    <Stack sx={{ bgcolor: "#FBEECD" }}>
      <motion.div
        initial={{ opacity: 0 }} // 初期状態: 透明
        animate={{ opacity: 1 }} // アニメーション: フェードイン
        exit={{ opacity: 0 }} // 終了時: フェードアウト
        transition={{ duration: 1 }} // アニメーションの長さ: 1秒
      >
        <Stack justifyContent="center" alignItems="center" height="100vh">
          <Box
            component="img"
            src="/top.png"
            alt="かわたび~可愛い子には旅をさせよ~"
            sx={{
              width: "100%",
              height: "auto",
            }}
          />
        </Stack>
      </motion.div>
    </Stack>
  );
}
