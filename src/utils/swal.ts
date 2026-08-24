import React from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, LogOut, type LucideIcon } from "lucide-react";
import Swal, { type SweetAlertIcon } from "sweetalert2";

export interface SwalModalOptions {
  /** Modal headline title (default: "Are you sure?") */
  title?: string;
  /** Description text / message */
  des?: string;
  /** Alias for `des` */
  description?: string;
  /** Pass any Lucide Icon component (e.g. Trash2, AlertTriangle), JSX element (<Trash2 />), or string preset */
  icon?: LucideIcon | React.ReactNode | SweetAlertIcon | "delete" | "trash" | "signout" | "logout" | "suspend" | "fired" | "warning" | "error" | "success" | "info" | string;
  /** Text for the confirm button (default: "Confirm") */
  confirmButtonText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelButtonText?: string;
  /** Whether to show the cancel button (default: true) */
  showCancelButton?: boolean;
  /** Whether to show the confirm button (default: true) */
  showConfirmButton?: boolean;
  /** Whether to place the confirm button on the right (default: true) */
  reverseButtons?: boolean;
  /** Apply danger red accent to the confirm button (default: false) */
  isDanger?: boolean;
  /** Callback executed when user confirms */
  onConfirm?: () => Promise<void> | void;
  /** Callback executed when user cancels or dismisses */
  onCancel?: () => Promise<void> | void;
}

/**
 * Returns custom SVG icon HTML for string presets.
 */
const getIconSvg = (icon?: string): { svg: string; color: string; bg: string; border: string; glow: string } => {
  switch (icon) {
    case "delete":
    case "trash":
    case "fired":
    case "error":
      return {
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "rgba(239, 68, 68, 0.3)",
        glow: "rgba(239, 68, 68, 0.35)",
        svg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #ef4444;"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
      };

    case "suspend":
    case "warning":
      return {
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.3)",
        glow: "rgba(245, 158, 11, 0.35)",
        svg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #f59e0b;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
      };

    case "success":
      return {
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.3)",
        glow: "rgba(16, 185, 129, 0.35)",
        svg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #10b981;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`,
      };

    case "info":
    case "question":
      return {
        color: "#3b82f6",
        bg: "rgba(59, 130, 246, 0.12)",
        border: "rgba(59, 130, 246, 0.3)",
        glow: "rgba(59, 130, 246, 0.35)",
        svg: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #3b82f6;"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      };

    case "signout":
    case "logout":
    default:
      return {
        color: "#f06a7d",
        bg: "hsl(352 58% 49% / 0.12)",
        border: "hsl(352 58% 49% / 0.28)",
        glow: "hsl(352 58% 49% / 0.35)",
        svg: `<svg class="w-6 h-6 text-[#f06a7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #f06a7d;"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>`,
      };
  }
};

/**
 * Dynamic SweetAlert modal customized for the NJ Multi Agency UI design system.
 *
 * @example
 * ```ts
 * // 1. Using a Lucide Icon component:
 * import { Trash2 } from "lucide-react";
 * const confirmed = await showCustomSwal({
 *   title: "Delete Pitcher?",
 *   des: "This action will permanently delete this pitcher and cannot be undone.",
 *   icon: Trash2,
 *   confirmButtonText: "Yes, Delete",
 *   cancelButtonText: "Cancel",
 *   isDanger: true,
 * });
 *
 * // 2. Calling with no options (all defaults applied):
 * const confirmed = await showCustomSwal();
 * ```
 */
export const showCustomSwal = async (options: SwalModalOptions = {}): Promise<boolean> => {
  const {
    title = "Are you sure?",
    des,
    description = des,
    icon,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    showCancelButton = true,
    showConfirmButton = true,
    reverseButtons = true,
    isDanger = false,
    onConfirm,
    onCancel,
  } = options;

  const result = await Swal.fire({
    title,
    html: description
      ? `
        <div class="swal-custom-body">
          <p class="swal-custom-desc">
            ${description}
          </p>
        </div>
      `
      : undefined,
    showCancelButton,
    showConfirmButton,
    confirmButtonText,
    cancelButtonText,
    reverseButtons,
    buttonsStyling: false,
    customClass: {
      popup: "nj-swal-popup",
      container: "nj-swal-container",
      title: "nj-swal-title",
      htmlContainer: "nj-swal-html",
      actions: "nj-swal-actions",
      confirmButton: isDanger ? "nj-swal-btn-confirm bg-red-600 hover:bg-red-700 !border-red-500/50" : "nj-swal-btn-confirm",
      cancelButton: "nj-swal-btn-cancel",
    },
    didOpen: (modal) => {
      const existingIcon = modal.querySelector(".nj-swal-icon-wrapper");
      if (!existingIcon) {
        const iconContainer = document.createElement("div");
        iconContainer.className = "nj-swal-icon-wrapper";
        const iconInner = document.createElement("div");
        iconInner.className = "nj-swal-icon-inner";
        iconContainer.appendChild(iconInner);
        modal.insertBefore(iconContainer, modal.firstChild);

        // 1. If a JSX element is passed: <Trash2 className="..." />
        if (React.isValidElement(icon)) {
          createRoot(iconInner).render(icon);
        }
        // 2. If a Lucide Icon component is passed: icon={Trash2}
        else if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in (icon as object))) {
          const IconComponent = icon as LucideIcon;
          createRoot(iconInner).render(
            React.createElement(IconComponent, {
              size: 24,
              className: `w-6 h-6 ${isDanger ? "text-red-500" : "text-[#f06a7d]"}`,
            })
          );
        }
        // 3. If a string preset is passed: "delete" | "warning" | "success" | etc.
        else if (typeof icon === "string") {
          const preset = getIconSvg(icon);
          iconInner.style.background = preset.bg;
          iconInner.style.borderColor = preset.border;
          iconInner.style.boxShadow = `0 0 20px -3px ${preset.glow}`;
          iconInner.innerHTML = preset.svg;
        }
        // 4. Default fallback icon (AlertTriangle) if nothing is provided
        else {
          createRoot(iconInner).render(
            React.createElement(AlertTriangle, {
              size: 24,
              className: `w-6 h-6 ${isDanger ? "text-red-500" : "text-[#f06a7d]"}`,
            })
          );
        }
      }
    },
  });

  if (result.isConfirmed) {
    if (onConfirm) await onConfirm();
    return true;
  } else {
    if (onCancel) await onCancel();
    return false;
  }
};

/**
 * Custom styled Sign Out confirmation modal matching NJ Multi Agency design language.
 */
export const confirmSignOut = async (onConfirm: () => Promise<void> | void) => {
  return showCustomSwal({
    title: "Sign Out of Account?",
    des: "Are you sure you want to end your current session? You'll need to sign back in to access your projects and dashboard.",
    icon: LogOut,
    confirmButtonText: "Sign Out",
    cancelButtonText: "Cancel",
    onConfirm,
  });
};

export default Swal;
