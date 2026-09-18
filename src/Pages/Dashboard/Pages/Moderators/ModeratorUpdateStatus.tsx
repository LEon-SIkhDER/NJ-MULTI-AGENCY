import type { UseQueryResult } from "@tanstack/react-query";
import { axiosSecure } from "../../../../Hooks/useAxiosSecure";
import type React from "react";
import toast from "react-hot-toast";
import { showCustomSwal } from "../../../../utils/swal";

type props = { className: string, status: string, children: React.ReactNode, id: string, refetch: UseQueryResult["refetch"], name: string }
const ModeratorUpdateStatus = ({ className, status, children, id, refetch, name }: props) => {
    const handleStatus = async () => {
        const desText = `Are you sure to ${status.toUpperCase()} ${name}`
        const confirm = await showCustomSwal({
            des: desText,
            confirmButtonText: status === "suspend" ? "Suspend" : status === "fired" ? "Fire" : status === "active" ? "Activate" : "Update",
        })
        if (!confirm) return

        const toastId = toast.loading(status === "suspend" ? "Suspending" : status === "fired" ? "Firing" : "Updating")
        try {
            const { data: result } = await axiosSecure.patch(`/moderator/${id}`, { status })
            if (!result.modifiedCount) {
                throw new Error("Update Failed")
            }
            await refetch()
            toast.dismiss(toastId)
            toast.success(status === "suspend" ? "Suspended" : status === "fired" ? "Fired" : "Updated")
        } catch (error) {
            const err = error as { message?: string }
            toast.dismiss(toastId)
            toast.error(err.message || "Something went wrong")
        }
    }

    return (
        <button onClick={handleStatus} className={className}>
            {children}
        </button>
    );
};

export default ModeratorUpdateStatus;
