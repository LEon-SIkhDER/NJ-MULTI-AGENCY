import React, { useRef } from 'react';
import { X, ClipboardList, User, Phone, AlignLeft, Link as LinkIcon } from 'lucide-react';
import useAuth from '../../../../Hook/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';

import type { UseQueryResult } from '@tanstack/react-query';

type props = { children: React.ReactNode, className: string, pitcher: Pitcher, refetch?: UseQueryResult["refetch"] | (() => void) }
type FormDataType = {
    name: string;
    notice: string;
    numbers: string;
    uri: string;
    assignedBy?: string;
    assignedTo?: string;
}
type Pitcher = {
    NID: {
        // Add your actual NID object fields here
        [key: string]: any;
    }[];
    activePitches: number;
    avgClientPerMonth: number;
    bio: string;
    createdAt: string;
    email: string;
    experienceYears: string;
    gender: string;
    image: {
        photoUrl: string;
        publicId: string;
    };
    joinedAt: string;
    maxQualification: string;
    name: string;
    permanentAddress: string;
    phone: string;
    presentAddress: string;
    role: string;
    specialization: string;
    status: string;
    successRate: number;
    successfullyHandledClient: number;
    totalClientsHandled: number;
    uid: string;
    updatedAt: string;
    _id: string;
};
const AssignTasks = ({ children, className, pitcher, refetch }: props) => {
    console.log(pitcher)
    const { user } = useAuth()
    console.log(user)

    const taskModalRef = useRef<HTMLDialogElement | null>(null)
    const addTaskFormRef = useRef<HTMLFormElement | null>(null)

    const handleSubmitTasks = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        taskModalRef?.current?.close()
        if (!user) return toast.error('Firebase Error')
        const formData = Object.fromEntries(new FormData(e.currentTarget)) as FormDataType
        formData.assignedBy = user?.uid
        formData.assignedTo = pitcher?.uid
        const toastId = toast.loading('Assigning Task')
        try {
            const { data: result } = await axios.post("`https://nj-multi-agency-api.vercel.app/task", formData)
            if (!result.insertedId) {
                throw new Error("Assign Failed")
            }
            if (refetch) await refetch()
            toast.dismiss(toastId)
            toast.success("Task Assigned")
        } catch (error) {
            const err = error as { message?: string }
            toast.dismiss(toastId)
            toast.error(err.message || "Something went wrong")
        }

        console.log(formData);

    }
    const closeModal = () => {
        taskModalRef?.current?.close()
        addTaskFormRef?.current?.reset()

    }

    return (
        <>
            {/* ── Trigger Button ── */}
            <button className={className} onClick={() => taskModalRef.current?.showModal()}>
                {children}
            </button>

            {/* ── DaisyUI Modal ── */}
            <dialog ref={taskModalRef} className="modal">
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
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "55%", height: "2px", background: "linear-gradient(90deg, transparent, #c43448, transparent)", boxShadow: "0 0 14px hsl(352 58% 49% / 0.45)" }} />

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}>
                        <div>
                            <div className="inline-flex items-center gap-2 mb-1">
                                <ClipboardList size={16} style={{ color: "#f06a7d" }} />
                                <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: "hsl(220 20% 94%)" }}>
                                    Assign Task
                                </h3>
                            </div>
                            <p className="text-xs" style={{ color: "hsl(220 10% 52%)" }}>
                                Fill in the task details to assign to this pitcher.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer"
                            style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 20%)", color: "hsl(220 10% 60%)" }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* ── Scrollable Form Body ── */}
                    <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: "72vh" }}>
                        <form onSubmit={handleSubmitTasks} ref={addTaskFormRef}>

                            {/* ── Task Name ── */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label htmlFor="task-name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>
                                    Client Name / Industry Name
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }}>
                                        <User size={15} />
                                    </span>
                                    <input
                                        id="task-name"
                                        name="name"
                                        type="text"
                                        placeholder="Name of Client or Page"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* ── Numbers ── */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label htmlFor="task-numbers" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>
                                    Numbers
                                    <span className="ml-1.5 normal-case font-normal text-[11px]" style={{ color: "hsl(220 10% 40%)" }}>
                                        (separate multiple with commas)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }}>
                                        <Phone size={15} />
                                    </span>
                                    <input
                                        id="task-numbers"
                                        name="numbers"
                                        type="text"
                                        placeholder="e.g. +880 1700-000000, +880 1800-000000"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>



                            {/* ── Page URL ── */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label htmlFor="task-uri" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>
                                    Source URL
                                    <span className="ml-1.5 normal-case font-normal text-[11px]" style={{ color: "hsl(220 10% 40%)" }}>
                                        (link to the page / profile)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }}>
                                        <LinkIcon size={15} />
                                    </span>
                                    <input
                                        id="task-url"
                                        name="url"
                                        type="url"
                                        placeholder="e.g. https://facebook.com/pagename"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* ── Notice ── */}
                            <div className="flex flex-col gap-1.5 mb-4">
                                <label htmlFor="task-notice" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>
                                    Notice / Instructions
                                </label>
                                <div className="relative">
                                    <AlignLeft size={15} className="absolute left-3 top-3 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }} />
                                    <textarea
                                        id="task-notice"
                                        name="notice"
                                        rows={3}
                                        placeholder="Any special instructions or notes for the pitcher…"
                                        style={{ ...inputStyle, paddingLeft: "2.25rem", resize: "vertical", height: "auto" }}
                                    />
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex items-center justify-end gap-3 pt-5 mt-2" style={{ borderTop: "1px solid hsl(222 10% 14%)" }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                                    style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 22%)", color: "hsl(220 15% 75%)" }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl cursor-pointer">
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Backdrop close */}
                <form method="dialog" className="modal-backdrop">
                    <button type="submit" onClick={closeModal}>close</button>
                </form>
            </dialog>
        </>
    );
};

/*  Shared input style  */
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

export default AssignTasks;