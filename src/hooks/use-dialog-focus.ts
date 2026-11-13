import { useRef, type RefObject } from "react";

// Controlled dialogs may have multiple openers, so Radix's single Trigger is insufficient.
export function useDialogFocus(fallback: RefObject<HTMLElement | null>) {
  const opener = useRef<HTMLElement | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const rememberOpener = (element: HTMLElement) => {
    opener.current = element;
  };
  return {
    rememberOpener,
    titleProps: { ref: title, tabIndex: -1 },
    contentProps: {
      onOpenAutoFocus: (event: Event) => {
        event.preventDefault();
        title.current?.focus();
      },
      onCloseAutoFocus: (event: Event) => {
        event.preventDefault();
        const visible = (element: HTMLElement | null) =>
          element?.isConnected &&
          element.getClientRects().length &&
          getComputedStyle(element).visibility !== "hidden" &&
          !element.hasAttribute("disabled");
        const target = visible(opener.current) ? opener.current : fallback.current;
        if (visible(target)) target?.focus();
      },
    },
  };
}
