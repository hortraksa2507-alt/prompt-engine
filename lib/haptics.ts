// Haptic feedback utility - works in Capacitor (native iOS) and degrades gracefully on web
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

export async function hapticLight() {
  if (isNative) {
    await Haptics.impact({ style: ImpactStyle.Light });
  } else if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export async function hapticMedium() {
  if (isNative) {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } else if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(20);
  }
}

export async function hapticHeavy() {
  if (isNative) {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } else if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(30);
  }
}

export async function hapticSuccess() {
  if (isNative) {
    await Haptics.notification({ type: NotificationType.Success });
  } else if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([10, 50, 10]);
  }
}

export async function hapticError() {
  if (isNative) {
    await Haptics.notification({ type: NotificationType.Error });
  } else if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([30, 20, 30]);
  }
}
