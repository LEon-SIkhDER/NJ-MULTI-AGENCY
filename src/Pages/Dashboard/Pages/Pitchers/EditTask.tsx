import React, { useRef, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { User, Phone, AlignLeft, Link as LinkIcon, X, ClipboardList } from "lucide-react";
import { axiosSecure } from "../../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import type { UseQueryResult } from "@tanstack/react-query";

type Task = {
    _id: string;
    name: string;
    numbers: string;
    url?: string;
    uri?: string;
    notice?: string;
    status?: string;
};

type Props = {
    children: React.ReactNode;
    className?: string;
    task: Task;
    refetch: UseQueryResult["refetch"] | (() => void);
};

const EditTask = ({ children, className, task, refetch }: Props) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleOpenModal = () => {
        modalRef.current?.showModal();
    };

    const handleCloseModal = () => {
        modalRef.current?.close();
    };

    const handleEditTask = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget)) as any;
        if (formData.url) {
            formData.uri = formData.url;
        }

        const toastId = toast.loading("Updating task...");
        try {
            const { data: result } = await axiosSecure.patch(`/task/${task._id}`, formData);
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Update Failed");
            }
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task updated successfully");
            handleCloseModal();
        } catch (error) {
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <>
            <button onClick={handleOpenModal} type="button" className={className}>
                {children}
            </button>

            {typeof document !== "undefined" && createPortal(
                <dialog ref={modalRef} className="modal">
                    <div
                        className="modal-box relative w-11/12 max-w-xl p-0 overflow-hidden"
                        style={{
                            background: "hsl(222 14% 9%)",
                            border: "1px solid hsl(222 10% 17%)",
                            borderRadius: "20px",
                            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)",
                        }}
                    >
                    {/* Top accent glow line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "55%",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #c43448, transparent)",
                            boxShadow: "0 0 14px hsl(352 58% 49% / 0.45)",
                        }}
                    />

                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-6 pt-6 pb-5"
                        style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 mb-1">
                                <ClipboardList size={16} style={{ color: "#f06a7d" }} />
                                <h3
                                    className="font-display text-lg font-bold tracking-tight"
                                    style={{ color: "hsl(220 20% 94%)" }}
                                >
                                    Edit Task Details
                                </h3>
                            </div>
                            <p className="text-xs" style={{ color: "hsl(220 10% 52%)" }}>
                                Modify task instructions, contact details, or target link.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer"
                            style={{
                                background: "hsl(222 12% 14%)",
                                border: "1px solid hsl(222 10% 20%)",
                                color: "hsl(220 10% 60%)",
                            }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: "72vh" }}>
                        <form onSubmit={handleEditTask} ref={formRef}>
                            {/* Client Name */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label
                                    htmlFor="edit-task-name"
                                    className="text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: "hsl(220 10% 52%)" }}
                                >
                                    Client Name / Page Name
                                </label>
                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{ color: "hsl(220 10% 45%)" }}
                                    >
                                        <User size={15} />
                                    </span>
                                    <input
                                        id="edit-task-name"
                                        name="name"
                                        type="text"
                                        defaultValue={task.name || ""}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Numbers */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label
                                    htmlFor="edit-task-numbers"
                                    className="text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: "hsl(220 10% 52%)" }}
                                >
                                    Numbers
                                    <span
                                        className="ml-1.5 normal-case font-normal text-[11px]"
                                        style={{ color: "hsl(220 10% 40%)" }}
                                    >
                                        (comma separated)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{ color: "hsl(220 10% 45%)" }}
                                    >
                                        <Phone size={15} />
                                    </span>
                                    <input
                                        id="edit-task-numbers"
                                        name="numbers"
                                        type="text"
                                        defaultValue={task.numbers || ""}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Target URL */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label
                                    htmlFor="edit-task-url"
                                    className="text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: "hsl(220 10% 52%)" }}
                                >
                                    Source / Profile URL
                                </label>
                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{ color: "hsl(220 10% 45%)" }}
                                    >
                                        <LinkIcon size={15} />
                                    </span>
                                    <input
                                        id="edit-task-url"
                                        name="url"
                                        type="url"
                                        defaultValue={task.url || task.uri || ""}
                                        placeholder="https://..."
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Notice / Instructions */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label
                                    htmlFor="edit-task-notice"
                                    className="text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: "hsl(220 10% 52%)" }}
                                >
                                    Notice / Notes
                                </label>
                                <div className="relative">
                                    <AlignLeft
                                        size={15}
                                        className="absolute left-3 top-3 pointer-events-none"
                                        style={{ color: "hsl(220 10% 45%)" }}
                                    />
                                    <textarea
                                        id="edit-task-notice"
                                        name="notice"
                                        rows={3}
                                        defaultValue={task.notice || ""}
                                        placeholder="Instructions or remarks..."
                                        style={{
                                            ...inputStyle,
                                            paddingLeft: "2.25rem",
                                            resize: "vertical",
                                            height: "auto",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div
                                className="flex items-center justify-end gap-3 pt-5 mt-2"
                                style={{ borderTop: "1px solid hsl(222 10% 14%)" }}
                            >
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                                    style={{
                                        background: "hsl(222 12% 14%)",
                                        border: "1px solid hsl(222 10% 22%)",
                                        color: "hsl(220 15% 75%)",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleCloseModal}>close</button>
                </form>
            </dialog>,
            document.body
        )}
        </>
    );
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.85rem 0.6rem 2.25rem",
    background: "hsl(222 12% 11%)",
    border: "1px solid hsl(222 10% 18%)",
    borderRadius: 10,
    color: "hsl(220 20% 90%)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.18s",
};

export default EditTask;
