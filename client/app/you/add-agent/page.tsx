"use client";

import SearchAddress from "@/app/CommonCode/HelperComp/SearchAddress";
import { useState, useEffect } from "react";
import { useCreateAgentMutation } from "@/app/RTK Query/adminApi"

export default function AddAgentPage() {
  const [createAgent, { isLoading }] = useCreateAgentMutation();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    altMobile: "",
    aadhaar: "",
    operatingRange: "",
    passcode: "",
    agree: false,
  });

  const [hasViewedTerms, setHasViewedTerms] = useState(false);

  const [location, setLocation] = useState({
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
    pincode: null as number | null,
    eLoc: "",
    street: "",
  });

  // Restore state after returning
  useEffect(() => {
    const viewed = sessionStorage.getItem("viewed_terms");
    if (viewed === "true") {
      setHasViewedTerms(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : false;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const HandleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationSelect = (geo: any) => {
    if (!geo) return;

    setLocation({
      address: geo.address || "",
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
      pincode: geo.pincode || null,
      eLoc: geo.eLoc || "",
      street: geo.address || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasViewedTerms) {
      alert("Please view Terms & Conditions first");
      return;
    }

    if (!formData.agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        altMobile: formData.altMobile,
        aadhaar: formData.aadhaar,
        passcode: formData.passcode,
        operatingRange: formData.operatingRange,
        isAgree: formData.agree, // 🔥 IMPORTANT
        location,
      };

      const res = await createAgent({
        payload,
        captchaToken: "", // add later
      }).unwrap();

      console.log("SUCCESS:", res);
      alert("Agent Created Successfully");

      sessionStorage.removeItem("viewed_terms");

    } catch (err: any) {
      console.error("ERROR:", err);
      alert(err?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 pb-16">
      <h1 className="text-2xl font-bold mb-6">Add Agent</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Agent Details */}
        <input
          type="text"
          name="name"
          placeholder="Agent Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="tel"
          name="altMobile"
          placeholder="Alternate Mobile Number"
          value={formData.altMobile}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Address */}
        <h2 className="font-semibold mt-4">Address Details</h2>

        <div>
          <label>Address *</label>
          <SearchAddress onSelect={handleLocationSelect} />
        </div>

        <input
          type="text"
          placeholder="Street / Area"
          value={location.street}
          onChange={(e) =>
            setLocation({ ...location, street: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Pincode"
          value={location.pincode || ""}
          onChange={(e) =>
            setLocation({
              ...location,
              pincode: Number(e.target.value),
            })
          }
          required
          className="w-full border p-2 rounded"
        />

        {/* Other Fields */}
        <textarea
          name="operatingRange"
          placeholder="Operating Area / Range"
          value={formData.operatingRange}
          onChange={HandleTextArea}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="passcode"
          placeholder="Create Passcode"
          value={formData.passcode}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Terms */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            disabled={!hasViewedTerms}
          />

          <label className={!hasViewedTerms ? "text-gray-400" : ""}>
            I agree to Terms & Conditions
          </label>

          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("viewed_terms", "true");
              window.open("/you/agent-policy-before-add", "_blank");
            }}
            className="text-blue-500 hover:underline"
          >
            View Terms
          </button>
        </div>

        {!hasViewedTerms && (
          <p className="text-xs text-red-500">
            Please view Terms & Conditions first
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded text-white ${
            formData.agree ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}


// "use client";

// import SearchAddress from "@/app/CommonCode/HelperComp/SearchAddress";
// import { useState, useEffect } from "react";

// export default function AddAgentPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     altMobile: "",
//     aadhaar: "",
//     operatingRange: "",
//     passcode: "",
//     agree: false,
//   });

//   const [hasViewedTerms, setHasViewedTerms] = useState(false);

//   const [location, setLocation] = useState({
//     address: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//     pincode: null as number | null,
//     eLoc: "",
//     street: "",
//   });

//   // Restore state after returning
//   useEffect(() => {
//     const viewed = sessionStorage.getItem("viewed_terms");
//     if (viewed === "true") {
//       setHasViewedTerms(true);
//     }
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
//     const checked = type === "checkbox" ? e.target.checked : false;

//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const HandleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleLocationSelect = (geo: any) => {
//     if (!geo) return;

//     setLocation({
//       address: geo.address || "",
//       latitude: geo.latitude || null,
//       longitude: geo.longitude || null,
//       pincode: geo.pincode || null,
//       eLoc: geo.eLoc || "",
//       street: geo.address || "",
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!hasViewedTerms) {
//       alert("Please view Terms & Conditions first");
//       return;
//     }

//     if (!formData.agree) {
//       alert("Please accept Terms & Conditions");
//       return;
//     }

//     const finalData = {
//       ...formData,
//       location,
//     };

//     console.log("Agent Data:", finalData);

//     // Optional cleanup
//     sessionStorage.removeItem("viewed_terms");

//     // TODO: API call
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Add Agent</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Agent Details */}
//         <input
//           type="text"
//           name="name"
//           placeholder="Agent Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="tel"
//           name="mobile"
//           placeholder="Mobile Number"
//           value={formData.mobile}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="tel"
//           name="altMobile"
//           placeholder="Alternate Mobile Number"
//           value={formData.altMobile}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="text"
//           name="aadhaar"
//           placeholder="Aadhaar Number"
//           value={formData.aadhaar}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />

//         {/* Address */}
//         <h2 className="font-semibold mt-4">Address Details</h2>

//         <div>
//           <label>Address *</label>
//           <SearchAddress onSelect={handleLocationSelect} />
//         </div>

//         <input
//           type="text"
//           placeholder="Street / Area"
//           value={location.street}
//           onChange={(e) =>
//             setLocation({ ...location, street: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="number"
//           placeholder="Pincode"
//           value={location.pincode || ""}
//           onChange={(e) =>
//             setLocation({
//               ...location,
//               pincode: Number(e.target.value),
//             })
//           }
//           required
//           className="w-full border p-2 rounded"
//         />

//         {/* Other Fields */}
//         <textarea
//           name="operatingRange"
//           placeholder="Operating Area / Range"
//           value={formData.operatingRange}
//           onChange={HandleTextArea}
//           required
//           className="w-full border p-2 rounded"
//         />

//         <input
//           type="password"
//           name="passcode"
//           placeholder="Create Passcode"
//           value={formData.passcode}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />

//         {/* Terms Section */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <input
//             type="checkbox"
//             name="agree"
//             checked={formData.agree}
//             onChange={handleChange}
//             disabled={!hasViewedTerms}
//           />

//           <label className={!hasViewedTerms ? "text-gray-400" : ""}>
//             I agree to Terms & Conditions
//           </label>

//           <button
//             type="button"
//             onClick={() => {
//               sessionStorage.setItem("viewed_terms", "true");
//               window.open("/you/agent-policy-before-add", "_blank");
//             }}
//             className="text-blue-500 hover:underline"
//           >
//             View Terms
//           </button>
//         </div>

//         {!hasViewedTerms && (
//           <p className="text-xs text-red-500">
//             Please view Terms & Conditions first
//           </p>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           className={`w-full py-2 rounded text-white ${
//             formData.agree ? "bg-green-600" : "bg-gray-400"
//           }`}
//         >
//           Submit
//         </button>

//       </form>
//     </div>
//   );
// }
