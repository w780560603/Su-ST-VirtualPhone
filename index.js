/**
 * 苏苏小手机 - 主入口
 *
 * 只负责：
 * 1. 初始化手机系统
 * 2. 由手机模块自己注册“手机”入口
 *
 * 手机的具体功能全部位于 toolkit/phone/
 */

import logger from "./logger.js";
import { initPhone } from "./toolkit/phone/index.js";

async function initSuVirtualPhone() {
  try {
    logger.info("main", "[SuVirtualPhone] 开始初始化");

    await initPhone();

    logger.info("main", "[SuVirtualPhone] 初始化完成");
  } catch (error) {
    logger.error(
      "main",
      "[SuVirtualPhone] 初始化失败:",
      error?.message || error
    );
  }
}

initSuVirtualPhone();
