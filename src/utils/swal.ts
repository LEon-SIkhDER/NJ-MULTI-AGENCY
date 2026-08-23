import Swal from "sweetalert2";

/**
 * Custom styled Sign Out confirmation modal matching NJ Multi Agency design language.
 */
export const confirmSignOut = async (onConfirm: () => Promise<void> | void) => {
  const result = await Swal.fire({
    title: "Sign Out of Account?",
    html: `
      <div class="swal-custom-body">
        <p class="swal-custom-desc">
          Are you sure you want to end your current session? You'll need to sign back in to access your projects and dashboard.
        </p>
      </div>
    `,
    icon: undefined,
    showCancelButton: true,
    confirmButtonText: "Sign Out",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: "nj-swal-popup",
      container: "nj-swal-container",
      title: "nj-swal-title",
      htmlContainer: "nj-swal-html",
      actions: "nj-swal-actions",
      confirmButton: "nj-swal-btn-confirm",
      cancelButton: "nj-swal-btn-cancel",
    },
    didOpen: (modal) => {
      const existingIcon = modal.querySelector(".nj-swal-icon-wrapper");
      if (!existingIcon) {
        const iconContainer = document.createElement("div");
        iconContainer.className = "nj-swal-icon-wrapper";
        iconContainer.innerHTML = `
          <div class="nj-swal-icon-inner">
            <svg class="w-6 h-6 text-[#f06a7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: #f06a7d;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        `;
        modal.insertBefore(iconContainer, modal.firstChild);
      }
    },
  });

  if (result.isConfirmed) {
    await onConfirm();
  }

  return result.isConfirmed;
};

export default Swal;
