"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Kiểm tra component đã mount phía client mà không cần gọi setState trong useEffect (tránh lỗi hydration & cascading render).
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

