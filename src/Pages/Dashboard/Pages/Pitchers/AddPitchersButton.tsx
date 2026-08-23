import { useRef, useState, type SyntheticEvent } from "react";
import { Camera, User, Phone, Mail, MapPin, Calendar, Briefcase, AlignLeft, X, ImagePlus } from "lucide-react";
import axios from "axios";
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
  NID: object[]
};
const AddPitchersButton = ({ children, className, refetch }: { children: React.ReactNode; className: string, refetch: UseQueryResult["refetch"] }) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [nidPreview, setNidPreview] = useState<string[]>([]);
  const [sameAddress, setSameAddress] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  // const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) setCvPreview(URL.createObjectURL(file));
  // };

  const handleNidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 2)
    if (files) {
      const tempPreview = files.map(file => URL.createObjectURL(file))
      setNidPreview(tempPreview);
    }
  };
  console.log(nidPreview);
  const formRef = useRef<HTMLFormElement | null>(null)
  const handleCloseModal = () => {
    modalRef.current?.close()
    // setCvPreview(null)
    setPhotoPreview(null)
    setNidPreview([])
    formRef.current?.reset()

  }
  const handleAddPitcher = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    modalRef.current?.close()
    console.log(e.currentTarget)
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as unknown as FormDataType
    console.log(formData)
    if (sameAddress) {
      formData.permanentAddress = formData.presentAddress
    }
    formData.joinedAt = new Date(formData.joinedAt)
    // const allImages = [formData.photo, formData.cvFile]

    let toastId = toast.loading("Uploading Image...")
    try {
      if (!formData.photo?.name) {
        formData.image = { photoUrl: "", publicId: "" }
      }
      else {
        const imageData = new FormData()
        imageData.append("file", formData.photo)
        imageData.append('upload_preset', import.meta.env.VITE_cloudinaryUploadPreset)

        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinaryCloudName}/image/upload`, imageData)
        formData.image = { photoUrl: data.secure_url, publicId: data.public_id }
        // return { url: data.secure_url, publicId: data.public_id }
      }
      toastId = toast.loading("Uploading NID...", { id: toastId })

      if (!formData.NIDFile?.length) {
        console.log("did not get name")
        formData.NID = [{ NIDUrl: "", publicId: "" }]
      }
      else {
        const tempNIDData = []

        for (const file of Array.from(formData.NIDFile || [])) {

          const NIDData = new FormData()
          NIDData.append("file", file)
          NIDData.append("upload_preset", import.meta.env.VITE_cloudinaryUploadPreset)
          const { data: NIDURLs } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinaryCloudName}/image/upload`, NIDData)
          tempNIDData.push({ NIDURL: NIDURLs.secure_url, publicId: NIDURLs.public_id })
        }
        formData.NID = tempNIDData
      }


      toastId = toast.loading("Inserting Pitcher...", { id: toastId })
      delete formData.photo
      delete formData.NIDFile
      console.log(formData)

      const { data: result } = await axios.post('http://localhost:5000/pitcher', formData)
      if (!result.insertedId) {
        throw new Error('Failed to add Pitcher')
      }

      // refetch
      await refetch()



      toast.success("Pitcher Added")
      toast.dismiss(toastId)
      handleCloseModal()
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId)
    }



    // for (const image of allImages) {
    //   if (!image?.name) {
    //     continue
    //   }
    //   try {

    //   } catch (error) {

    //   }


    // }

  }


  return (
    <>
      <button onClick={() => modalRef.current?.showModal()} className={className}>{children}</button>

      <dialog ref={modalRef} className="modal">
        {/*  Modal Box  */}
        <div className="modal-box relative w-11/12 max-w-2xl p-0 overflow-hidden"
          style={{ background: "hsl(222 14% 9%)", border: "1px solid hsl(222 10% 17%)", borderRadius: "20px", boxShadow: "0 25px 60px -12px rgba(0,0,0,0.85), 0 0 40px -8px hsl(352 58% 49% / 0.18)" }}>

          {/* Top accent glow line */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "55%", height: "2px", background: "linear-gradient(90deg, transparent, #c43448, transparent)", boxShadow: "0 0 14px hsl(352 58% 49% / 0.45)" }} />

          {/*  Header  */}
          <div className="flex items-center justify-between px-6 pt-6 pb-5" style={{ borderBottom: "1px solid hsl(222 10% 14%)" }}>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: "hsl(220 20% 94%)" }}>Add Pitcher</h3>
              <p className="text-xs mt-0.5" style={{ color: "hsl(220 10% 52%)" }}>Fill in the details to register a new pitcher.</p>
            </div>
            <form method="dialog">
              <button className="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer"
                style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 20%)", color: "hsl(220 10% 60%)" }}>
                <X size={15} />
              </button>
            </form>
          </div>

          {/*  Scrollable Form Body  */}
          <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: "75vh" }}>
            <form onSubmit={handleAddPitcher} ref={formRef}>

              {/*  Profile Picture  */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <label htmlFor="pitcher-photo" className="cursor-pointer">
                  <div className="relative flex items-center justify-center overflow-hidden"
                    style={{ width: 96, height: 96, borderRadius: "50%", background: "hsl(222 12% 12%)", border: "2px dashed hsl(352 58% 49% / 0.45)" }}>
                    {photoPreview
                      ? <img src={photoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      : <div className="flex flex-col items-center gap-1">
                        <Camera size={26} style={{ color: "hsl(352 58% 49% / 0.7)" }} />
                        <span className="text-xs font-medium" style={{ color: "hsl(220 10% 52%)" }}>Photo</span>
                      </div>
                    }
                  </div>
                </label>
                <input id="pitcher-photo" name="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <p className="text-xs" style={{ color: "hsl(220 10% 45%)" }}>Click to upload profile picture</p>
              </div>

              {/*  Personal Information  */}
              <SectionLabel label="Personal Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <Field id="pitcher-name" name="name" label="Full Name" type="text" placeholder="e.g. Nafis Hasan" icon={<User size={15} />} required />
                <Field id="pitcher-phone" name="phone" label="Phone Number" type="tel" placeholder="+880 1XXX-XXXXXX" icon={<Phone size={15} />} required />
                <Field id="pitcher-email" name="email" label="Email Address" type="email" placeholder="pitcher@example.com" icon={<Mail size={15} />} required />

                {/* Gender ” DaisyUI select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pitcher-gender" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>Gender</label>
                  <select id="pitcher-gender" name="gender" required className="select select-bordered w-full text-sm"
                    style={{ background: "hsl(222 12% 11%)", borderColor: "hsl(222 10% 18%)", color: "hsl(220 20% 90%)" }}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    {/* <option value="other">Other</option> */}
                    {/* <option value="prefer_not_to_say">Prefer not to say</option> */}
                  </select>
                </div>
              </div>

              {/*  Qualification & Joining  */}
              <SectionLabel label="Qualification & Joining" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                {/* Max Qualification ” DaisyUI select */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pitcher-qualification" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>Max Qualification</label>
                  <select id="pitcher-qualification" name="maxQualification" required className="select select-bordered w-full text-sm"
                    style={{ background: "hsl(222 12% 11%)", borderColor: "hsl(222 10% 18%)", color: "hsl(220 20% 90%)" }}>
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <Field id="pitcher-joined" name="joinedAt" label="Joined At" type="date" icon={<Calendar size={15} />} required />
              </div>

              {/*  Professional Details  */}
              <SectionLabel label="Professional Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <Field id="pitcher-experience" name="experienceYears" label="Experience (years)" type="number" placeholder="e.g. 3" icon={<Briefcase size={15} />} />
                <Field id="pitcher-specialization" name="specialization" label="Specialization" type="text" placeholder="e.g. Startup Pitching" icon={<Briefcase size={15} />} />
              </div>
              <div className="mt-4">
                <label htmlFor="pitcher-bio" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>Short Bio</label>
                <div className="relative mt-1.5">
                  <AlignLeft size={15} className="absolute left-3 top-3 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }} />
                  <textarea id="pitcher-bio" name="bio" rows={3} placeholder="A brief description about the pitcher"
                    style={{ ...inputStyle, paddingLeft: "2.25rem", resize: "vertical", height: "auto" }} />
                </div>
              </div>

              {/*  Address  */}
              <SectionLabel label="Address" />
              <div className="grid grid-cols-1 gap-4 mt-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pitcher-present-address" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>Present Address</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }} />
                    <textarea id="pitcher-present-address" name="presentAddress" rows={2} placeholder="House, Road, Area, City" required
                      style={{ ...inputStyle, paddingLeft: "2.25rem", resize: "vertical", height: "auto" }} />
                  </div>
                </div>

                {/* Same-address toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                  <input type="checkbox" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)}
                    style={{ accentColor: "#c43448", width: 15, height: 15 }} />
                  <span className="text-xs font-medium" style={{ color: "hsl(220 10% 62%)" }}>Permanent address same as present</span>
                </label>

                {!sameAddress && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pitcher-permanent-address" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>Permanent Address</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-3 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }} />
                      <textarea id="pitcher-permanent-address" name="permanentAddress" rows={2} placeholder="House, Road, Area, City" required
                        style={{ ...inputStyle, paddingLeft: "2.25rem", resize: "vertical", height: "auto" }} />
                    </div>
                  </div>
                )}
              </div>


              {/* NID Images Upload */}
              <SectionLabel label="NID Images (Front & Back)" />
              <div className="mt-3">
                <label htmlFor="nid-images" className="flex flex-col items-center justify-center gap-3 px-4 py-5 cursor-pointer transition-colors overflow-hidden" style={{ background: "hsl(222 12% 11%)", border: "1.5px dashed hsl(352 58% 49% / 0.35)", borderRadius: 12, minHeight: 160 }}>
                  {nidPreview?.length > 0
                    ? <div className="grid grid-cols-2 gap-3 w-full">
                      {nidPreview?.map((preview, index) => <img key={index} src={preview} alt={`NID ${index === 0 ? "front" : "back"} preview`} className="w-full object-contain rounded-lg" style={{ maxHeight: 200 }} />)}
                    </div>
                    : <>
                      <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 10, background: "hsl(352 58% 49% / 0.12)", border: "1px solid hsl(352 58% 49% / 0.28)" }}>
                        <ImagePlus size={20} style={{ color: "#f06a7d" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold" style={{ color: "hsl(220 20% 80%)" }}>Upload NID Front & Back</p>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(220 10% 52%)" }}>Select 2 images — JPG, PNG, WEBP</p>
                      </div>
                    </>
                  }
                  <input id="nid-images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleNidChange(e)} />
                </label>
              </div>
              {nidPreview.length > 0 && (
                <button type="button" onClick={() => setNidPreview([])}
                  className="mt-2 text-xs font-medium transition-colors" style={{ color: "hsl(352 58% 65%)", background: "none", border: "none", cursor: "pointer" }}>
                  Click to Remove image
                </button>
              )}

              {/*  Actions  */}
              <div className="flex items-center justify-end gap-3 pt-5 mt-5" style={{ borderTop: "1px solid hsl(222 10% 14%)" }}>
                {/* <form method="dialog"> */}
                <button onClick={handleCloseModal} type="button" className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                  style={{ background: "hsl(222 12% 14%)", border: "1px solid hsl(222 10% 22%)", color: "hsl(220 15% 75%)" }}>
                  Cancel
                </button>
                {/* </form> */}
                <button type="submit" className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl">
                  Add Pitcher
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Backdrop close */}
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </>
  );
};

/*  Shared input style  */
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.6rem 0.85rem 0.6rem 2.25rem",
  background: "hsl(222 12% 11%)", border: "1px solid hsl(222 10% 18%)",
  borderRadius: 10, color: "hsl(220 20% 90%)", fontSize: "0.875rem",
  outline: "none", transition: "border-color 0.18s",
};

/*  Field component  */
const Field = ({ id, name, label, type, placeholder, icon, required }: {
  id: string; name: string; label: string; type: string;
  placeholder?: string; icon: React.ReactNode; required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(220 10% 52%)" }}>{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(220 10% 45%)" }}>{icon}</span>
      <input id={id} name={name} type={type} placeholder={placeholder} required={required} style={inputStyle} />
    </div>
  </div>
);

/*  Section Label  */
const SectionLabel = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mt-6 mb-1">
    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f06a7d", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "hsl(222 10% 16%)" }} />
  </div>
);

export default AddPitchersButton;
