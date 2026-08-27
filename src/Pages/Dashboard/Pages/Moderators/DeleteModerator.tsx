import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { showCustomSwal } from "../../../../utils/swal";
import { Trash } from "lucide-react";

type props = { children: React.ReactNode, className: string, uid: string }

const DeleteModerator = ({ children, className, uid }: props) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const handleDelete = async () => {
        const confirm = await showCustomSwal({
            des: "You won't be able to revert this!",
            confirmButtonText: "Delete",
            icon: Trash
        })
        if (!confirm) return

        const toastId = toast.loading("Deleting")
        try {
            const { data: result } = await axios.delete(`http://localhost:5000/moderator/${uid}`)
            console.log(result)
            if (!result.deletedCount) {
                throw new Error("Delete Failed")
            }
            await queryClient.invalidateQueries({
                queryKey: ["moderators"],
            });
            navigate("/admin/moderators")
            toast.dismiss(toastId)
            toast.success("Deleted")
        } catch (error: unknown) {
            console.log(error)
            const err = error as { message?: string }
            toast.dismiss(toastId)
            toast.error(err.message || "Something went wrong")
        }
    }
    return (
        <button onClick={handleDelete} className={className}>
            {children}
        </button>
    );
};

export default DeleteModerator;
