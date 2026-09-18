import React, { useRef, useState, useId, useEffect, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { Camera, User as UserIcon, Phone, Mail, MapPin, Calendar, Briefcase, AlignLeft, X, ImagePlus } from "lucide-react";
import axios from "axios";
import { axiosSecure } from "../../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import type { UseQueryResult } from "@tanstack/react-query";

const QUALIFICATIONS = [
    "Primary / Class 5", "JSC / Class 8", "JDC / Class 8", "SSC", "Dakhil",
    "SSC (Vocational)", "HSC", "Alim", "HSC (Vocational)", "Diploma",
    "Diploma in Engineering", "Degree (Pass)", "Fazil", "Honours / Bachelor's",
    "Kamil / Master's", "Master's", "MPhil", "PhD", "Other",
];

type FormDataType = {
    bio: string;
    email: string;
    experienceYears: string;
    gender: string;
    image: {
        photoUrl: string;
        publicId: string;
    };
    joinedAt: string | Date;
    maxQualification: string;
    name: string;
    phone: string;
    presentAddress: string;
    permanentAddress?: string;
    specialization: string;
    photo?: File;
    NIDFile?: File[];
    NID: object[];
    uid?: string;
    role: string;
};

export interface User {
    _id?: string;
    name?: string;
    email?: string;
    uid?: string;
    role?: string;
    status?: string;
    result?: string;
    photoUrl?: string;
    photoURL?: string;
    phone?: string;
    gender?: string;
    presentAddress?: string;
    permanentAddress?: string;
    bio?: string;
    createdAt?: string | number | Date;
}

type Props = {
    children: React.ReactNode;
    className?: string;
    refetch: UseQueryResult["refetch"];
    user: User;
    approveRole: string;
};

const Approve = ({ children, className, refetch, user, approveRole }: Props) => {
    const role = approveRole.charAt(0).toUpperCase() + approveRole.slice(1);

    const photoInputId = useId();
    const nidInputId = useId();

    const modalRef = useRef<HTMLDialogElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const photoInputRef = useRef<HTMLInputElement | null>(null);
    const nidInputRef = useRef<HTMLInputElement | null>(null);

    const initialPhoto = user?.photoUrl || user?.photoURL || user?.result || null;
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);
    const [imageError, setImageError] = useState(false);
    const [nidPreview, setNidPreview] = useState<string[]>([]);
    const [sameAddress, setSameAddress] = useState(false);

    const firstLetter = (user?.name || "U").trim().charAt(0).toUpperCase();

    // Keep photo preview in sync if user object updates
    useEffect(() => {
        setImageError(false);
        setPhotoPreview(user?.photoUrl || user?.photoURL || user?.result || null);
    }, [user?.photoUrl, user?.photoURL, user?.result]);

    const defaultJoinedAt = user?.createdAt
        ? new Date(user.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

    const handleOpenModal = () => {
        setImageError(false);
        setPhotoPreview(user?.photoUrl || user?.photoURL || user?.result || null);
        setNidPreview([]);
        setSameAddress(false);
        modalRef.current?.showModal();
    };

    const handleCloseModal = () => {
        modalRef.current?.close();
        setImageError(false);
        setPhotoPreview(user?.photoUrl || user?.photoURL || user?.result || null);
        setNidPreview([]);
        setSameAddress(false);
        if (formRef.current) formRef.current.reset();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageError(false);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleNidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, 2);
        if (files.length > 0) {
            const tempPreview = files.map((file) => URL.createObjectURL(file));
            setNidPreview(tempPreview);
        }
    };

    const handleRemoveNid = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setNidPreview([]);
        if (nidInputRef.current) nidInputRef.current.value = "";
    };

    const handleAddPitcher = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        modalRef.current?.close();
        const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown as FormDataType;

        if (sameAddress) {
            formData.permanentAddress = formData.presentAddress;
        }
        formData.joinedAt = new Date(formData.joinedAt);

        const photoFile = photoInputRef.current?.files?.[0];
        const selectedNidFiles = Array.from(nidInputRef.current?.files || []).slice(0, 2);

        let toastId = toast.loading("Uploading Image...");
        try {
            if (!user.uid || !user.email) {
                throw new Error("UID missing");
            }

            if (!photoFile) {
                formData.image = { photoUrl: initialPhoto || "", publicId: "" };
            } else {
                const imageData = new FormData();
                imageData.append("file", photoFile);
                imageData.append("upload_preset", import.meta.env.VITE_cloudinaryUploadPreset);

                const { data } = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinaryCloudName}/image/upload`,
                    imageData
                );
                formData.image = { photoUrl: data.secure_url, publicId: data.public_id };
            }

            toastId = toast.loading("Uploading NID...", { id: toastId });

            if (!selectedNidFiles.length) {
                formData.NID = [{ NIDUrl: "", publicId: "" }];
            } else {
                const tempNIDData = [];

                for (const file of selectedNidFiles) {
                    const NIDData = new FormData();
                    NIDData.append("file", file);
                    NIDData.append("upload_preset", import.meta.env.VITE_cloudinaryUploadPreset);
                    const { data: NIDURLs } = await axios.post(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinaryCloudName}/image/upload`,
                        NIDData
                    );
                    tempNIDData.push({ NIDURL: NIDURLs.secure_url, publicId: NIDURLs.public_id });
                }
                formData.NID = tempNIDData;
            }

            toastId = toast.loading(`Inserting ${role}...`, { id: toastId });
            delete formData.photo;
            delete formData.NIDFile;

            formData.uid = user.uid;
            formData.email = user.email;
            formData.role = approveRole;

            const { data: result } = await axiosSecure.post("/employee", formData);
            if (!result.insertedId) {
                throw new Error(`Failed to add ${role}`);
            }

            await refetch();

            toast.success(`${role} Added`);
            toast.dismiss(toastId);
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(`Failed to add ${role}`);
        }
    };

    return (
        <>
            <button onClick={handleOpenModal} type="button" className={className}>
                {children}
            </button>

            {createPortal(
                <dialog ref={modalRef} className="modal">
                    {/* Modal Box */}
                    <div className="modal-box relative w-11/12 max-w-2xl p-0 overflow-hidden bg-surface border border-border rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85),0_0_40px_-8px_hsl(352_58%_49%_/_0.18)]">
                        {/* Top accent glow line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-[2px] bg-gradient-to-r from-transparent via-[#c43448] to-transparent shadow-[0_0_14px_hsl(352_58%_49%_/_0.45)] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border/80">
                            <div>
                                <h3 className="font-display text-xl font-bold tracking-tight text-white">
                                    Approve as {role}
                                </h3>
                                <p className="text-xs mt-0.5 text-text-muted">
                                    Fill in the details to promote this user to agency {role}.
                                </p>
                                {user.uid && (
                                    <p className="text-[10px] font-mono text-text-faint mt-0.5">{user.uid}</p>
                                )}
                            </div>
                            <form method="dialog">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-2 hover:bg-surface border border-border text-text-muted hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={15} />
                                </button>
                            </form>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="overflow-y-auto px-6 py-6 max-h-[75vh]">
                            <form onSubmit={handleAddPitcher} ref={formRef}>
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
                                                    <span className="text-[10px] font-medium text-text-muted mt-0.5">Click to upload</span>
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
                                    <p className="text-xs text-text-faint">Click to upload profile picture</p>
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
                                        defaultValue={user?.name || ""}
                                        icon={<UserIcon size={15} />}
                                        required
                                    />
                                    <Field
                                        id={`phone-${photoInputId}`}
                                        name="phone"
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        defaultValue={user?.phone || ""}
                                        icon={<Phone size={15} />}
                                        required
                                    />
                                    <Field
                                        id={`email-${photoInputId}`}
                                        disabled={true}
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        placeholder="user@example.com"
                                        defaultValue={user?.email || ""}
                                        icon={<Mail size={15} />}
                                        required
                                    />

                                    {/* Gender Select */}
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
                                            required
                                            defaultValue={user?.gender || ""}
                                            className="select w-full bg-surface-2 border border-border rounded-xl text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        >
                                            <option value="" className="bg-surface-2 text-text">Select gender</option>
                                            <option value="male" className="bg-surface-2 text-text">Male</option>
                                            <option value="female" className="bg-surface-2 text-text">Female</option>
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
                                            required
                                            defaultValue=""
                                            className="select w-full bg-surface-2 border border-border rounded-xl text-text text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        >
                                            <option value="" className="bg-surface-2 text-text">Select qualification</option>
                                            {QUALIFICATIONS.map((q) => (
                                                <option key={q} value={q} className="bg-surface-2 text-text">
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
                                        icon={<Briefcase size={15} />}
                                    />
                                    <Field
                                        id={`spec-${photoInputId}`}
                                        name="specialization"
                                        label="Specialization"
                                        type="text"
                                        placeholder="e.g. Startup Pitching"
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
                                            defaultValue={user?.bio || ""}
                                            placeholder={`A brief description about the ${role}`}
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
                                                defaultValue={user?.presentAddress || ""}
                                                placeholder="House, Road, Area, City"
                                                required
                                                className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                                            />
                                        </div>
                                    </div>

                                    {/* Same-address toggle */}
                                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit group">
                                        <input
                                            type="checkbox"
                                            checked={sameAddress}
                                            onChange={(e) => setSameAddress(e.target.checked)}
                                            className="w-4 h-4 rounded border border-border bg-surface-2 text-primary focus:ring-1 focus:ring-primary focus:outline-none accent-[#c43448] cursor-pointer transition-colors"
                                            style={{ accentColor: "#c43448" }}
                                        />
                                        <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors">
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
                                                    defaultValue={user?.permanentAddress || ""}
                                                    placeholder="House, Road, Area, City"
                                                    required
                                                    className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NID Images Upload */}
                                <SectionLabel label="NID Images (Front & Back)" />
                                <div className="mt-3">
                                    <label
                                        htmlFor={nidInputId}
                                        className="flex flex-col items-center justify-center gap-3 px-4 py-5 cursor-pointer bg-surface-2 border-1.5 border-dashed border-primary/35 hover:border-primary/70 rounded-xl transition-all overflow-hidden min-h-[160px]"
                                    >
                                        {nidPreview?.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                {nidPreview.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`NID ${index === 0 ? "front" : "back"} preview`}
                                                        className="w-full h-44 object-cover rounded-lg border border-border shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-dim border border-primary-border shadow-sm">
                                                    <ImagePlus size={20} className="text-[#f06a7d]" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-text">
                                                        Upload NID Front & Back
                                                    </p>
                                                    <p className="text-xs mt-0.5 text-text-muted">
                                                        Select 2 images — JPG, PNG, WEBP
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <input
                                            id={nidInputId}
                                            ref={nidInputRef}
                                            name="NIDFile"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            className="hidden"
                                            onChange={handleNidChange}
                                        />
                                    </label>
                                </div>
                                {nidPreview.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveNid}
                                        className="mt-2 text-xs font-medium text-[#f06a7d] hover:text-[#f06a7d]/80 transition-colors cursor-pointer bg-transparent border-0"
                                    >
                                        Click to Remove NID images
                                    </button>
                                )}

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
                                        Add {role}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Backdrop close */}
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={handleCloseModal}>close</button>
                    </form>
                </dialog>,
                document.body
            )}
        </>
    );
};

/* Field component */
const Field = ({
    id,
    name,
    label,
    type,
    placeholder,
    icon,
    required,
    defaultValue,
    disabled = false,
}: {
    id: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    icon: React.ReactNode;
    required?: boolean;
    defaultValue?: string | number;
    disabled?: boolean;
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
                disabled={disabled}
                className="w-full pl-9 pr-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
        </div>
    </div>
);

/* Section Label */
const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mt-6 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f06a7d] whitespace-nowrap">
            {label}
        </span>
        <div className="flex-1 h-px bg-border/80" />
    </div>
);

export default Approve;
