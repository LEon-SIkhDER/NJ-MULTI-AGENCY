import React, { useRef, useState, useId, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { Camera, User as UserIcon, Phone, Mail, MapPin, Calendar, Briefcase, AlignLeft, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { UseQueryResult } from "@tanstack/react-query";

const QUALIFICATIONS = [
    "Primary / Class 5", "JSC / Class 8", "JDC / Class 8", "SSC", "Dakhil",
    "SSC (Vocational)", "HSC", "Alim", "HSC (Vocational)", "Diploma",
    "Diploma in Engineering", "Degree (Pass)", "Fazil", "Honours / Bachelor's",
    "Kamil / Master's", "Master's", "MPhil", "PhD", "Other",
];

type Pitcher = {
    _id: string;
    uid: string;
    name: string;
    phone?: string;
    email?: string;
    gender?: string;
    maxQualification?: string;
    joinedAt?: string;
    experienceYears?: string;
    specialization?: string;
    bio?: string;
    presentAddress?: string;
    permanentAddress?: string;
    status?: string;
    image?: { photoUrl: string; publicId: string };
};

type Props = {
    children: React.ReactNode;
    className?: string;
    pitcher: Pitcher;
    refetch: UseQueryResult["refetch"] | (() => void);
};

const EditPitcher = ({ children, className, pitcher, refetch }: Props) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const photoInputRef = useRef<HTMLInputElement | null>(null);
    const photoInputId = useId();

    const [photoPreview, setPhotoPreview] = useState<string | null>(pitcher.image?.photoUrl || null);
    const [imageError, setImageError] = useState(false);
    const [sameAddress, setSameAddress] = useState(false);

    const defaultJoinedAt = pitcher.joinedAt
        ? new Date(pitcher.joinedAt).toISOString().split("T")[0]
        : "";

    const handleOpenModal = () => {
        setImageError(false);
        setPhotoPreview(pitcher.image?.photoUrl || null);
        modalRef.current?.showModal();
    };

    const handleCloseModal = () => {
        modalRef.current?.close();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageError(false);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleEditPitcher = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget)) as any;

        if (sameAddress) {
            formData.permanentAddress = formData.presentAddress;
        }

        const photoFile = photoInputRef.current?.files?.[0];
        let toastId = toast.loading("Updating Pitcher...");

        try {
            if (photoFile) {
                const imageData = new FormData();
                imageData.append("file", photoFile);
                imageData.append("upload_preset", import.meta.env.VITE_cloudinaryUploadPreset);

                const { data } = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinaryCloudName}/image/upload`,
                    imageData
                );
                formData.image = { photoUrl: data.secure_url, publicId: data.public_id };
            }

            delete formData.photo;

            const { data: result } = await axios.patch(`https://nj-multi-agency-api.vercel.app/pitcher/${pitcher._id}`, formData);
            if (!result.matchedCount && !result.modifiedCount) {
                throw new Error("Update failed");
            }

            await refetch();
            toast.dismiss(toastId);
            toast.success("Pitcher updated successfully");
            handleCloseModal();
        } catch (error) {
            console.error(error);
            const err = error as { message?: string };
            toast.dismiss(toastId);
            toast.error(err.message || "Failed to update pitcher");
        }
    };

    const firstLetter = (pitcher.name || "P").trim().charAt(0).toUpperCase();

    return (
        <>
            <button onClick={handleOpenModal} type="button" className={className}>
                {children}
            </button>

            {typeof document !== "undefined" && createPortal(
                <dialog ref={modalRef} className="modal">
                    <div className="modal-box relative w-11/12 max-w-2xl p-0 overflow-hidden bg-surface border border-border rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85),0_0_40px_-8px_hsl(352_58%_49%_/_0.18)]">
                        {/* Top accent glow line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[2px] bg-gradient-to-r from-transparent via-[#c43448] to-transparent shadow-[0_0_14px_hsl(352_58%_49%_/_0.45)] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-border/80">
                            <div>
                                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                                    Edit Pitcher Profile
                                </h3>
                                <p className="text-xs mt-0.5 text-text-muted">
                                    Update details and preferences for {pitcher.name}.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-2 hover:bg-surface border border-border text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
                            >
                                <X size={15} />
                            </button>
                        </div>

                    {/* Scrollable Form Body */}
                    <div className="overflow-y-auto px-6 py-6 max-h-[75vh]">
                        <form onSubmit={handleEditPitcher} ref={formRef}>
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center gap-2 mb-6">
                                <label
                                    htmlFor={photoInputId}
                                    className="group relative cursor-pointer flex items-center justify-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-surface-2 border-2 border-dashed border-primary/45 group-hover:border-primary flex items-center justify-center overflow-hidden transition-all shadow-inner relative">
                                        {photoPreview && !imageError ? (
                                            <img
                                                src={photoPreview}
                                                alt="Profile preview"
                                                referrerPolicy="no-referrer"
                                                onError={() => setImageError(true)}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full bg-primary-dim text-[#f06a7d]">
                                                <span className="text-2xl font-bold font-display">{firstLetter}</span>
                                                <span className="text-[10px] font-medium text-text-muted mt-0.5">Click to change</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-surface border border-border text-[#f06a7d] shadow-md group-hover:bg-primary-dim transition-colors">
                                        <Camera size={13} />
                                    </div>
                                    <input
                                        id={photoInputId}
                                        ref={photoInputRef}
                                        name="photo"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                                <p className="text-xs text-text-faint">Click to change profile picture</p>
                            </div>

                            {/* Personal Information */}
                            <SectionLabel label="Personal Information" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                <Field
                                    id={`name-${photoInputId}`}
                                    name="name"
                                    label="Full Name"
                                    type="text"
                                    placeholder="e.g. Nafis Hasan"
                                    defaultValue={pitcher.name || ""}
                                    icon={<UserIcon size={15} />}
                                    required
                                />
                                <Field
                                    id={`phone-${photoInputId}`}
                                    name="phone"
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+880 1XXX-XXXXXX"
                                    defaultValue={pitcher.phone || ""}
                                    icon={<Phone size={15} />}
                                    required
                                />
                                <Field
                                    id={`email-${photoInputId}`}
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="pitcher@example.com"
                                    defaultValue={pitcher.email || ""}
                                    icon={<Mail size={15} />}
                                    required
                                />

                                {/* Gender */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor={`gender-${photoInputId}`}
                                        className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        id={`gender-${photoInputId}`}
                                        name="gender"
                                        defaultValue={pitcher.gender || "male"}
                                        className="select select-bordered w-full bg-surface-2 border-border text-text text-sm focus:outline-none focus:border-primary"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Qualification & Joining */}
                            <SectionLabel label="Qualification & Joining" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor={`qual-${photoInputId}`}
                                        className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                    >
                                        Max Qualification
                                    </label>
                                    <select
                                        id={`qual-${photoInputId}`}
                                        name="maxQualification"
                                        defaultValue={pitcher.maxQualification || ""}
                                        className="select select-bordered w-full bg-surface-2 border-border text-text text-sm focus:outline-none focus:border-primary"
                                    >
                                        <option value="">Select qualification</option>
                                        {QUALIFICATIONS.map((q) => (
                                            <option key={q} value={q}>
                                                {q}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Field
                                    id={`joined-${photoInputId}`}
                                    name="joinedAt"
                                    label="Joined At"
                                    type="date"
                                    defaultValue={defaultJoinedAt}
                                    icon={<Calendar size={15} />}
                                    required
                                />
                            </div>

                            {/* Professional Details */}
                            <SectionLabel label="Professional Details" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                <Field
                                    id={`exp-${photoInputId}`}
                                    name="experienceYears"
                                    label="Experience (years)"
                                    type="number"
                                    placeholder="e.g. 3"
                                    defaultValue={pitcher.experienceYears || ""}
                                    icon={<Briefcase size={15} />}
                                />
                                <Field
                                    id={`spec-${photoInputId}`}
                                    name="specialization"
                                    label="Specialization"
                                    type="text"
                                    placeholder="e.g. Startup Pitching"
                                    defaultValue={pitcher.specialization || ""}
                                    icon={<Briefcase size={15} />}
                                />
                            </div>
                            <div className="mt-4">
                                <label
                                    htmlFor={`bio-${photoInputId}`}
                                    className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                >
                                    Short Bio
                                </label>
                                <div className="relative mt-1.5">
                                    <AlignLeft
                                        size={15}
                                        className="absolute left-3 top-3.5 pointer-events-none text-text-muted"
                                    />
                                    <textarea
                                        id={`bio-${photoInputId}`}
                                        name="bio"
                                        rows={3}
                                        defaultValue={pitcher.bio || ""}
                                        placeholder="A brief description about the pitcher"
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <SectionLabel label="Address" />
                            <div className="grid grid-cols-1 gap-4 mt-3">
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor={`present-address-${photoInputId}`}
                                        className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                    >
                                        Present Address
                                    </label>
                                    <div className="relative">
                                        <MapPin
                                            size={15}
                                            className="absolute left-3 top-3.5 pointer-events-none text-text-muted"
                                        />
                                        <textarea
                                            id={`present-address-${photoInputId}`}
                                            name="presentAddress"
                                            rows={2}
                                            defaultValue={pitcher.presentAddress || ""}
                                            placeholder="House, Road, Area, City"
                                            required
                                            className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                                    <input
                                        type="checkbox"
                                        checked={sameAddress}
                                        onChange={(e) => setSameAddress(e.target.checked)}
                                        className="checkbox checkbox-xs checkbox-primary rounded"
                                    />
                                    <span className="text-xs font-medium text-text-muted">
                                        Permanent address same as present
                                    </span>
                                </label>

                                {!sameAddress && (
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor={`perm-address-${photoInputId}`}
                                            className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                                        >
                                            Permanent Address
                                        </label>
                                        <div className="relative">
                                            <MapPin
                                                size={15}
                                                className="absolute left-3 top-3.5 pointer-events-none text-text-muted"
                                            />
                                            <textarea
                                                id={`perm-address-${photoInputId}`}
                                                name="permanentAddress"
                                                rows={2}
                                                defaultValue={pitcher.permanentAddress || ""}
                                                placeholder="House, Road, Area, City"
                                                className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-border/80">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className="px-5 py-2.5 text-sm font-medium rounded-xl bg-surface-2 hover:bg-surface-2/70 border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
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

const Field = ({
    id,
    name,
    label,
    type,
    placeholder,
    icon,
    required,
    defaultValue,
}: {
    id: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    icon: React.ReactNode;
    required?: boolean;
    defaultValue?: string | number;
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                {icon}
            </span>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                defaultValue={defaultValue}
                className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
        </div>
    </div>
);

const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mt-6 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f06a7d] whitespace-nowrap">
            {label}
        </span>
        <div className="flex-1 h-px bg-border/80" />
    </div>
);

export default EditPitcher;
