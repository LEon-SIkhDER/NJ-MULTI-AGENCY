import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { showCustomSwal } from "../../../../utils/swal";
import { Trash } from "lucide-react";
import useRole from "../../../../Hooks/useRole";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hook/useAuth";

type props = { children: React.ReactNode; className: string; uid: string };

const DeletePitcher = ({ children, className, uid }: props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { role } = useRole();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    if (role !== "admin") {
        return null;
    }

    const handleDelete = async () => {
        if (role !== "admin") {
            toast.error("Only administrators can delete pitchers.");
            return;
        }

        const confirm = await showCustomSwal({
            des: "You won't be able to revert this!",
            confirmButtonText: "Delete",
            icon: Trash,
        });
        if (!confirm) return;

        const toastId = toast.loading("Deleting");
        try {
            const { data: result } = await axiosSecure.delete(`/pitcher/${uid}`, {
                params: { requesterEmail: user?.email }
            });
            console.log(result);
            if (!result.deletedCount) {
                throw new Error("Delete Failed");
            }
            await queryClient.invalidateQueries({
                queryKey: ["pitchers"],
            });
            navigate("/admin/pitchers");
            toast.dismiss(toastId);
            toast.success("Deleted");
        } catch (error: unknown) {
            console.log(error);
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            toast.dismiss(toastId);
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        }
    };
    return (
        <button onClick={handleDelete} className={className}>
            {children}
        </button>
    );
};

export default DeletePitcher;