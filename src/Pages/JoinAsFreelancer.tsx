import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  X,
  ImagePlus,
  UploadCloud,
  CheckCircle2,
  FileText,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Send,
  Building2,
  GraduationCap,
  Clock,
  Globe,
  MessageSquare,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../Component/Logo";

const QUALIFICATIONS = [
  "Honours / Bachelor's (BBA / Management)",
  "Honours / Bachelor's (CSE / IT)",
  "Honours / Bachelor's (Other)",
  "Master's / MBA",
  "Degree (Pass)",
  "Diploma in Engineering / Computer",
  "HSC / Higher Secondary",
  "Other Relevant Professional Degree",
];

export default function JoinAsFreelancer() {
  const [submitted, setSubmitted] = useState(false);

  // Automatically scroll to the top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Address
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  // Government ID / NID
  const [nidNumber, setNidNumber] = useState("");
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);

  // Assistant Manager Role Information
  const [roleTitle] = useState("Assistant Manager - Operations & Team Lead");
  const [department, setDepartment] = useState("Agency Operations & Client Delivery");
  const [qualification, setQualification] = useState("");
  const [university, setUniversity] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [previousCompany, setPreviousCompany] = useState("");
  const [previousRole, setPreviousRole] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Full-time Freelancer");

  // Situational & Behavioral Questions (Role-Specific)
  const [scenarioPrioritization, setScenarioPrioritization] = useState("");
  const [scenarioEscalation, setScenarioEscalation] = useState("");

  // Documents & Links
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Declaration
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const fileInputPhotoRef = useRef<HTMLInputElement | null>(null);
  const fileInputNidFrontRef = useRef<HTMLInputElement | null>(null);
  const fileInputNidBackRef = useRef<HTMLInputElement | null>(null);
  const fileInputResumeRef = useRef<HTMLInputElement | null>(null);

  // Handle Photo Upload
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG, WEBP).");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle NID Front Upload
  const handleNidFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("NID Front must be an image file (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB.");
        return;
      }
      setNidFrontFile(file);
      setNidFrontPreview(URL.createObjectURL(file));
      toast.success("NID Front image uploaded!");
    }
  };

  // Handle NID Back Upload
  const handleNidBackChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("NID Back must be an image file (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB.");
        return;
      }
      setNidBackFile(file);
      setNidBackPreview(URL.createObjectURL(file));
      toast.success("NID Back image uploaded!");
    }
  };

  // Handle Resume Upload
  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toast.success(`Resume selected: ${file.name}`);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validations
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your contact phone number.");
      return;
    }
    if (!presentAddress.trim()) {
      toast.error("Please enter your present address.");
      return;
    }
    if (!nidNumber.trim()) {
      toast.error("Please provide your National ID (NID) number.");
      return;
    }
    if (!nidFrontFile && !nidFrontPreview) {
      toast.error("Please upload the NID card front picture.");
      return;
    }
    if (!nidBackFile && !nidBackPreview) {
      toast.error("Please upload the NID card back picture.");
      return;
    }
    if (!qualification) {
      toast.error("Please select your highest educational qualification.");
      return;
    }
    if (!experienceYears) {
      toast.error("Please select your management/work experience.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please confirm the declaration checkbox before submitting.");
      return;
    }

    const payload = {
      roleApplied: "Assistant Manager",
      roleTitle,
      department,
      appliedAt: new Date().toISOString(),
      personalInformation: {
        fullName,
        email,
        phone,
        whatsapp: whatsapp || phone,
        gender,
        dateOfBirth: dob,
        profilePhoto: photoFile
          ? {
              name: photoFile.name,
              size: `${(photoFile.size / 1024).toFixed(1)} KB`,
              type: photoFile.type,
              previewUrl: photoPreview,
            }
          : null,
      },
      address: {
        presentAddress,
        permanentAddress: sameAddress ? presentAddress : permanentAddress,
        sameAddress,
      },
      nidVerification: {
        nidNumber,
        nidFrontPicture: nidFrontFile
          ? {
              name: nidFrontFile.name,
              size: `${(nidFrontFile.size / 1024).toFixed(1)} KB`,
              type: nidFrontFile.type,
              previewUrl: nidFrontPreview,
            }
          : null,
        nidBackPicture: nidBackFile
          ? {
              name: nidBackFile.name,
              size: `${(nidBackFile.size / 1024).toFixed(1)} KB`,
              type: nidBackFile.type,
              previewUrl: nidBackPreview,
            }
          : null,
      },
      professionalBackground: {
        qualification,
        university,
        experienceYears,
        previousCompany,
        previousRole,
        currentStatus,
      },
      situationalResponses: {
        prioritizationUnderPressure: scenarioPrioritization,
        escalationAndConflictResolution: scenarioEscalation,
      },
      documentsAndLinks: {
        resume: resumeFile
          ? {
              name: resumeFile.name,
              size: `${(resumeFile.size / 1024).toFixed(1)} KB`,
              type: resumeFile.type,
            }
          : null,
        linkedinUrl,
        portfolioUrl,
      },
      declarationConfirmed: agreedToTerms,
    };

    // ==========================================
    // CONSOLE ALL DATA AFTER CLICKING SUBMIT
    // (Developer Console Only)
    // ==========================================
    console.log("=============================================================");
    console.log("🚀 [FREELANCE APPLICATION SUBMITTED - ASSISTANT MANAGER]");
    console.log("=============================================================");
    console.log("Full Submission Data Object:", payload);
    console.log("Applicant Details:", payload.personalInformation);
    console.log("National ID (NID) Information & Files:", payload.nidVerification);
    console.log("Role & Managerial Experience:", payload.professionalBackground);
    console.log("Situational Management Answers:", payload.situationalResponses);
    console.log("NID Front File Object:", nidFrontFile);
    console.log("NID Back File Object:", nidBackFile);
    console.log("Profile Photo File Object:", photoFile);
    console.log("Resume File Object:", resumeFile);
    console.table([
      { Field: "Full Name", Value: fullName },
      { Field: "Email", Value: email },
      { Field: "Phone", Value: phone },
      { Field: "Role", Value: roleTitle },
      { Field: "NID Number", Value: nidNumber },
      { Field: "NID Front", Value: nidFrontFile?.name || "Uploaded" },
      { Field: "NID Back", Value: nidBackFile?.name || "Uploaded" },
      { Field: "Qualification", Value: qualification },
      { Field: "Experience (Years)", Value: experienceYears },
    ]);
    console.log("=============================================================");

    setSubmitted(true);
    toast.success("Application submitted successfully!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-(--bg) text-(--text) flex flex-col justify-between selection:bg-[#c43448]/30">
      <Toaster />
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-orb absolute -top-[10%] right-[10%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.15)_0%,transparent_70%)]" />
        <div className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.09)_0%,transparent_70%)]" />
        <div className="absolute bottom-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.1)_0%,transparent_70%)]" />
      </div>

      {/* Standalone Header (No Shared Header) */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/10"
        >
          <ArrowLeft size={14} />
          <span>Back to Website</span>
        </Link>
      </header>

      <main className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 flex-1">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c43448]/10 border border-[#c43448]/30 text-xs font-semibold text-white/90 mb-4">
            <Sparkles size={14} className="text-[#c43448]" />
            <span>NJ Multi Agency • Freelance Career Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Apply as <span className="text-gradient-red">Assistant Manager</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Join our fast-growing agency leadership team. Coordinate high-impact campaigns, lead skilled creative & tech
            pitchers, and streamline operations with competitive freelance compensation.
          </p>

          {/* Role Highlights Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-left">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <Briefcase size={14} className="text-[#c43448]" />
                <span>Position</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">Assistant Manager</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <Clock size={14} className="text-[#c43448]" />
                <span>Job Type</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">Freelance / Hybrid</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <MapPin size={14} className="text-[#c43448]" />
                <span>Location</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">Dhaka / Remote</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <ShieldCheck size={14} className="text-[#c43448]" />
                <span>Verification</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">NID Verified</p>
            </div>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-2xl bg-white/[0.04] border border-[#c43448]/40 shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#c43448] to-transparent" />
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-[#c43448]/20 border border-[#c43448]/50 flex items-center justify-center text-[#c43448] mb-5">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Application Received!</h2>
              <p className="mt-3 text-sm text-white/70 max-w-lg leading-relaxed">
                Thank you, <span className="text-white font-semibold">{fullName}</span>. Your application for the{" "}
                <span className="text-[#f06a7d] font-semibold">{roleTitle}</span> position has been successfully submitted. Our team will review your application and contact you soon.
              </p>

              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c43448] hover:bg-[#a82a3c] text-white text-xs font-semibold transition-all shadow-lg shadow-[#c43448]/20 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl relative"
          >
            {/* Top red subtle line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#c43448] to-transparent shadow-[0_0_12px_#c43448]" />

            {/* SECTION 1: Personal & Contact Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d] mb-4">
                <User size={16} />
                <span>1. Personal & Contact Information</span>
              </div>

              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center justify-center gap-2 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div
                  onClick={() => fileInputPhotoRef.current?.click()}
                  className="relative group cursor-pointer h-24 w-24 rounded-full bg-white/5 border-2 border-dashed border-[#c43448]/40 hover:border-[#c43448] flex items-center justify-center overflow-hidden transition-all"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center p-2">
                      <ImagePlus size={22} className="text-[#f06a7d]" />
                      <span className="text-[10px] text-white/50">Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[11px] text-white font-medium transition-opacity">
                    Change
                  </div>
                </div>
                <input
                  ref={fileInputPhotoRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <span className="text-xs text-white/50">Upload Professional Profile Picture (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Full Name <span className="text-[#c43448]">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mahfuzur Rahman"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Email Address <span className="text-[#c43448]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. mahfuz@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Phone Number <span className="text-[#c43448]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  >
                    <option value="" className="bg-[#12161f] text-white">Select Gender</option>
                    <option value="Male" className="bg-[#12161f] text-white">Male</option>
                    <option value="Female" className="bg-[#12161f] text-white">Female</option>
                    <option value="Other" className="bg-[#12161f] text-white">Other</option>
                    <option value="Prefer not to say" className="bg-[#12161f] text-white">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Address Details */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d] mb-4">
                <MapPin size={16} />
                <span>2. Address Information</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Present Address <span className="text-[#c43448]">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    placeholder="House / Road No., Area, Thana, District"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors resize-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-xs text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                    className="checkbox checkbox-sm rounded-lg border-2 border-white/40 checked:border-[#c43448] checked:bg-[#c43448] text-white transition-all"
                  />
                  <span>Permanent address is the same as present address</span>
                </label>

                {!sameAddress && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                      Permanent Address
                    </label>
                    <textarea
                      rows={2}
                      value={permanentAddress}
                      onChange={(e) => setPermanentAddress(e.target.value)}
                      placeholder="Village / Road, Post Office, District"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Identity Verification (NID PICTURE INPUT FIELD - MANDATORY) */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d]">
                  <CreditCard size={16} />
                  <span>3. National ID (NID) Verification</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c43448]/20 border border-[#c43448]/40 text-[#f06a7d] font-semibold">
                  Required by Agency Policy
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  NID Card Number <span className="text-[#c43448]">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    required
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="Enter 10, 13, or 17 digit NID number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  />
                </div>
              </div>

              {/* NID Card Picture Upload Fields (Front & Back) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NID Front Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      NID Picture - Front Side <span className="text-[#c43448]">*</span>
                    </label>
                    {nidFrontFile && (
                      <span className="text-[11px] text-white/40 truncate max-w-[150px]">
                        {(nidFrontFile.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => fileInputNidFrontRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px] overflow-hidden ${
                      nidFrontPreview
                        ? "border-[#c43448]/60 bg-black/60"
                        : "border-white/15 bg-white/[0.02] hover:border-[#c43448]/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    {nidFrontPreview ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <img
                          src={nidFrontPreview}
                          alt="NID Front Preview"
                          className="max-h-32 object-contain rounded-lg shadow-md"
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-white/80 font-medium">Click to replace</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNidFrontPreview(null);
                              setNidFrontFile(null);
                            }}
                            className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="h-10 w-10 rounded-lg bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#f06a7d]">
                          <UploadCloud size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Upload NID Front Side</p>
                          <p className="text-[11px] text-white/40 mt-0.5">JPG, PNG, or WEBP (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputNidFrontRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNidFrontChange}
                    className="hidden"
                  />
                </div>

                {/* NID Back Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      NID Picture - Back Side <span className="text-[#c43448]">*</span>
                    </label>
                    {nidBackFile && (
                      <span className="text-[11px] text-white/40 truncate max-w-[150px]">
                        {(nidBackFile.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => fileInputNidBackRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px] overflow-hidden ${
                      nidBackPreview
                        ? "border-[#c43448]/60 bg-black/60"
                        : "border-white/15 bg-white/[0.02] hover:border-[#c43448]/40 hover:bg-white/[0.04]"
                    }`}
                  >
                    {nidBackPreview ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <img
                          src={nidBackPreview}
                          alt="NID Back Preview"
                          className="max-h-32 object-contain rounded-lg shadow-md"
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-white/80 font-medium">Click to replace</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNidBackPreview(null);
                              setNidBackFile(null);
                            }}
                            className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="h-10 w-10 rounded-lg bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#f06a7d]">
                          <UploadCloud size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Upload NID Back Side</p>
                          <p className="text-[11px] text-white/40 mt-0.5">JPG, PNG, or WEBP (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputNidBackRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNidBackChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Professional Qualifications & Assistant Manager Role Experience */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d] mb-4">
                <GraduationCap size={16} />
                <span>4. Qualifications & Experience (Assistant Manager Role)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Operational Track / Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  >
                    <option value="Agency Operations & Client Delivery" className="bg-[#12161f] text-white">Agency Operations & Client Delivery</option>
                    <option value="Digital Marketing & Performance Campaigns" className="bg-[#12161f] text-white">Digital Marketing & Performance Campaigns</option>
                    <option value="Creative Studio & Content Production" className="bg-[#12161f] text-white">Creative Studio & Content Production</option>
                    <option value="Web & Software Project Management" className="bg-[#12161f] text-white">Web & Software Project Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Highest Educational Qualification <span className="text-[#c43448]">*</span>
                  </label>
                  <select
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  >
                    <option value="" className="bg-[#12161f] text-white">Select Qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q} className="bg-[#12161f] text-white">{q}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    University / Institute Name
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. University of Dhaka, AIUB, NSU"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Management / Supervisory Experience <span className="text-[#c43448]">*</span>
                  </label>
                  <select
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  >
                    <option value="" className="bg-[#12161f] text-white">Select Experience Range</option>
                    <option value="Fresher / < 1 year" className="bg-[#12161f] text-white">Fresher / &lt; 1 Year (Eager to lead)</option>
                    <option value="1 - 2 Years" className="bg-[#12161f] text-white">1 - 2 Years Supervisory</option>
                    <option value="2 - 4 Years" className="bg-[#12161f] text-white">2 - 4 Years Management / Team Lead</option>
                    <option value="4+ Years" className="bg-[#12161f] text-white">4+ Years Senior Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Current Employment Status
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="select select-bordered w-full rounded-xl bg-black/40 border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  >
                    <option value="Full-time Freelancer" className="bg-[#12161f] text-white">Full-time Freelancer</option>
                    <option value="Employed (Looking for Part-time Freelance)" className="bg-[#12161f] text-white">Employed (Available Part-time)</option>
                    <option value="Available Immediately" className="bg-[#12161f] text-white">Available Immediately</option>
                    <option value="Student" className="bg-[#12161f] text-white">Student / Graduating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Previous Organization / Agency
                  </label>
                  <input
                    type="text"
                    value={previousCompany}
                    onChange={(e) => setPreviousCompany(e.target.value)}
                    placeholder="e.g. Creative Media Ltd or Self-Employed"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Previous Designation / Role
                  </label>
                  <input
                    type="text"
                    value={previousRole}
                    onChange={(e) => setPreviousRole(e.target.value)}
                    placeholder="e.g. Project Coordinator / Operations Officer"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: Situational Role Assessment Questions */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d] mb-4">
                <FileText size={16} />
                <span>5. Situational Assessment Questions</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    1. How do you prioritize tasks and ensure deadlines are met when multiple agency clients request urgent deliverables at the same time?
                  </label>
                  <textarea
                    rows={3}
                    value={scenarioPrioritization}
                    onChange={(e) => setScenarioPrioritization(e.target.value)}
                    placeholder="Briefly describe your delegation, prioritization matrix, and client communication strategy under tight timelines..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    2. Describe a scenario where a project hit a bottleneck or a client expressed dissatisfaction. How would you handle the team and retain client satisfaction?
                  </label>
                  <textarea
                    rows={3}
                    value={scenarioEscalation}
                    onChange={(e) => setScenarioEscalation(e.target.value)}
                    placeholder="Describe your root-cause analysis, de-escalation communication, and corrective action approach..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: Resume & Professional Links */}
            <div className="mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#f06a7d] mb-4">
                <Globe size={16} />
                <span>6. Resume & Online Profiles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Portfolio / Website Link
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#c43448] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Resume / CV Upload (PDF, DOC, DOCX)
                  </label>
                  <div
                    onClick={() => fileInputResumeRef.current?.click()}
                    className="p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#f06a7d]">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {resumeFile ? resumeFile.name : "Select or Drop Resume"}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {resumeFile
                            ? `${(resumeFile.size / 1024).toFixed(1)} KB`
                            : "PDF, DOCX up to 10MB"}
                        </p>
                      </div>
                    </div>
                    {resumeFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="text-white/40 hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputResumeRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7: Declaration & Submit */}
            <div className="pt-6 border-t border-white/10">
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/15 hover:border-[#c43448]/40 transition-colors mb-6">
                <label className="flex items-start gap-3.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="checkbox checkbox-sm sm:checkbox-md rounded-lg border-2 border-white/40 checked:border-[#c43448] checked:bg-[#c43448] text-white mt-0.5 transition-all"
                  />
                  <span className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    I hereby declare that all the information and uploaded government NID pictures provided in this application are accurate and belong to me. I understand that false statements will disqualify my application for the Assistant Manager position at NJ Multi Agency Group. <span className="text-[#c43448] font-bold">*</span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <ShieldCheck size={14} className="text-[#f06a7d]" />
                  <span>All submissions are securely processed and verified.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#c43448] hover:bg-[#a82a3c] text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#c43448]/25 hover:shadow-[#c43448]/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Submit Application</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Standalone Simple Footer (No Shared Footer) */}
      <footer className="relative z-10 py-6 border-t border-white/10 text-center text-xs text-white/40">
        <p>© {new Date().getFullYear()} NJ Multi Agency Group. All rights reserved.</p>
      </footer>
    </div>
  );
}
