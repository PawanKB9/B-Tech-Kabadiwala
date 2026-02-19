import Image from "next/image";

export const revalidate = 86400; // Revalidate once per day

export default function AboutPage() {
  const company = "B Tech Kabadiwala";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 sm:px-8 py-14 text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">
            About <span className="text-gray-900">{company}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A technology-driven recycling startup transforming India’s
            traditional scrap ecosystem into a structured, transparent and
            sustainable digital platform.
          </p>
        </section>

        {/* ACCORDION CONTENT */}
        <section className="space-y-5">

          <Accordion
            title="Executive Summary"
            preview="Modernizing India’s unorganized scrap ecosystem through technology."
            content="B Tech Kabadiwala is a technology-enabled scrap collection and recycling startup based in Kanpur, Uttar Pradesh. Our platform digitizes traditional scrap operations by integrating structured scheduling, transparent processes, and scalable aggregation systems. We aim to build a reliable recycling infrastructure that benefits households, businesses, and the environment."
          />

          <Accordion
            title="Problem Statement"
            preview="India’s scrap sector remains largely unorganized and inefficient."
            content="The traditional scrap ecosystem lacks pricing transparency, operational tracking, structured logistics, and digital access. Households often face inconsistent rates, unreliable pickups, and no systematic record of transactions. This inefficiency results in recyclable materials being diverted to landfills instead of formal recycling channels."
          />

          <Accordion
            title="Our Solution"
            preview="A structured, digital-first scrap collection platform."
            content="B Tech Kabadiwala introduces a modernized system where customers can schedule scrap pickup, ensure structured handling, and contribute to sustainable waste management. By integrating technology with local scrap operations, we improve efficiency, accountability, and scalability."
          />

          <Accordion
            title="Our Mission"
            preview="Making recycling simple, digital and rewarding."
            content="Our mission is to build an organized recycling ecosystem that empowers individuals to recycle responsibly while contributing to environmental sustainability and resource conservation."
          />

          <Accordion
            title="Our Vision"
            preview="Revolutionizing India’s recycling infrastructure."
            content="We envision a future where technology eliminates inefficiencies in scrap management and creates a nationwide structured recycling network driven by data, transparency, and sustainability."
          />

          <Accordion
            title="Core Values"
            preview="Sustainability, transparency, technology and community."
            content="Our operations are guided by sustainability-first thinking, transparent processes, digital innovation, scalable systems, and community empowerment. Every operational decision aligns with long-term environmental and economic impact."
          />

          <Accordion
            title="Foundation & Journey"
            preview="From ideation (2023–24) to official launch on 21 February 2026."
            content="The concept was developed during 2023–24 after identifying inefficiencies in the scrap ecosystem. In March–April 2025, prototype development began including website creation, database architecture, branding, market research, Udyam registration, Digital Signature acquisition, and compliance groundwork. After structured planning and overcoming institutional hurdles, B Tech Kabadiwala officially launched on 21 February 2026."
          />

          <Accordion
            title="Major Hurdles & Resilience"
            preview="Overcoming institutional and structural challenges."
            content="During early development stages, structural and incubation-related challenges required strategic repositioning and independent restructuring. The transition strengthened the startup’s clarity, autonomy, and long-term operational independence."
          />

          <Accordion
            title="Business Model"
            preview="Structured scrap aggregation with scalable revenue channels."
            content="Revenue is generated through margin-based scrap aggregation and structured channelization to recycling partners. Future expansion includes institutional collection partnerships, analytics integration, and digital marketplace capabilities."
          />

          <Accordion
            title="Target Market"
            preview="Urban households, students, offices and institutions."
            content="Our primary market includes urban households, PG residents, small offices, and local businesses. Secondary expansion targets include institutions, hostels, commercial complexes, and bulk generators."
          />

          <Accordion
            title="Competitive Advantage"
            preview="Digital-first, structured and scalable model."
            content="Unlike traditional scrap collectors, B Tech Kabadiwala integrates structured data management, operational tracking, scalability planning, and brand positioning to build a professional and reliable recycling service."
          />

          <Accordion
            title="Environmental Impact"
            preview="Reducing landfill burden and supporting circular economy."
            content="Each collection cycle contributes to reducing landfill waste, conserving natural resources, and improving recycling efficiency. Long-term objectives include impact reporting systems and measurable sustainability metrics."
          />

          <Accordion
            title="Growth Strategy"
            preview="City-level stabilization followed by multi-city expansion."
            content="Phase 1 focuses on operational stabilization in Kanpur. Phase 2 involves city-wide expansion and institutional onboarding. Phase 3 includes multi-city scaling, app development, data analytics integration, and strategic partnerships."
          />

          <Accordion
            title="Legal & Compliance"
            preview="Structured documentation and regulatory readiness."
            content="The startup has completed Udyam registration, Digital Signature acquisition, trademark documentation groundwork, and structured operational documentation to ensure regulatory compliance."
          />

          <Accordion
            title="Brand Positioning"
            preview="Modern, sustainable and youth-driven."
            content="B Tech Kabadiwala is positioned as a technology-enabled recycling brand built on trust, sustainability, and operational transparency. Tagline concept: 'Recycle Smart. Earn Smart. Live Smart.'"
          />

          <Accordion
            title="Future Roadmap"
            preview="App launch, analytics and institutional partnerships."
            content="Upcoming developments include mobile application launch, structured warehouse optimization, real-time analytics, and institutional contracts to scale operations sustainably."
          />

          <Accordion
            title="Why B Tech Kabadiwala?"
            preview="Because recycling should be organized, fair and convenient."
            content="We are building a structured ecosystem where technology meets sustainability, youth drives innovation, and scrap becomes measurable environmental value."
          />

        </section>
                {/* FOUNDER */}
        <section className="bg-white rounded-3xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-8 my-16">
          <div className="relative w-40 h-32 rounded-full overflow-hidden border border-gray-200">
            <Image
              src="https://res.cloudinary.com/dtviazgmp/image/upload/v1771522944/ChatGPT_Image_Jan_24_2026_10_34_08_PM_1_uoyby5.png"
              alt="Pawan Kumar Bind"
              fill
              className=""
              priority
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-green-700">
              Pawan Kumar Bind
            </h2>
            <p className="text-gray-600 mb-2">
              Founder – B Tech Kabadiwala
            </p>
            <p className="text-sm text-gray-500">
              Kanpur, Uttar Pradesh
            </p>
            <p className="text-sm text-gray-500">
              btechkabadiwala@zohomail.in | 8005000270
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 text-center text-sm text-gray-500 border-t pt-6">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-green-700">
            B Tech Kabadiwala
          </span>
          . All Rights Reserved.
        </footer>

      </div>
    </main>
  );
}

/* ---------------- ACCORDION ---------------- */

function Accordion({
  title,
  preview,
  content,
}: {
  title: string;
  preview: string;
  content: string;
}) {
  return (
    <details className="group bg-white rounded-2xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg">
      <summary className="list-none">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-1">
              {title}
            </h3>
            <p className="text-gray-600 text-sm">
              {preview}
            </p>
          </div>
          <span className="text-green-700 text-2xl transition-transform duration-300 group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <div className="mt-4 text-gray-700 leading-relaxed text-sm">
        {content}
      </div>
    </details>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Mail, MapPin, Linkedin } from "lucide-react";

// import { useGetAppDataQuery } from "@/app/RTK Query/appApi";
// import { useCaptcha } from "@/app/CommonCode/auth/captchaHook";
// import GlobalLoader from "@/app/CommonCode/UiCode/GlobalLoader";

// export default function AboutUs() {
//   const { getCaptchaToken } = useCaptcha();

//   const [captchaToken, setCaptchaToken] = useState<string | null>(null);

//   const {
//     data: appData,
//     isLoading,
//     isError,
//     error,
//   } = useGetAppDataQuery(
//     { captchaToken },
//     {
//       skip: captchaToken === "__BLOCKED__",
//     }
//   );

//   useEffect(() => {
//     const maybeRequestCaptcha = async () => {
//       if (!error) return;

//       const err: any = error;

//       const captchaRequired =
//         err?.status === 403 &&
//         err?.data?.captcha_required === true;

//       if (!captchaRequired) return;

//       const token = await getCaptchaToken("fetch_app_data");

//       if (!token) {
        
//         setCaptchaToken("__BLOCKED__");
//         return;
//       }

//       setCaptchaToken(token);
//     };

//     maybeRequestCaptcha();
//   }, [error, getCaptchaToken]);


//   if(isLoading || !appData) {
//     return <GlobalLoader isLoading={isLoading} />;
//   }

//   const { aboutUs } = appData;

//   return (
//     <main className="h-[100vh] pb-14 overflow-y-auto scrollbar-hide bg-gradient-to-b from-green-50 to-white text-gray-800 px-4 sm:px-8 py-10 flex flex-col items-center">
//       {/* Hero */}
//       <section className="text-center max-w-[1280px] mb-10">
//         <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 mb-4">
//           About <span className="text-gray-900">{aboutUs.info.company}</span>
//         </h1>
//         <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
//           {aboutUs.introduction}
//         </p>
//       </section>

//       {/* Founder */}
//       <section className="w-full max-w-[1280px] bg-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:gap-20 gap-6 p-6 sm:p-8 mb-10">
//         <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
//           <Image
//             src={aboutUs.info.url}
//             alt={aboutUs.info.name}
//             fill
//             sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 300px"
//             className="object-cover"
//             priority
//           />
//         </div>

//         <div className="text-center sm:text-left flex flex-col gap-2">
//           <h2 className="text-2xl font-bold text-green-700">
//             {aboutUs.info.name}
//           </h2>
//           <p className="text-gray-600">
//             Founder, {aboutUs.info.company}
//           </p>

//           <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
//             <MapPin className="w-4 h-4 text-green-600" />
//             {aboutUs.info.address}
//           </p>

//           <div className="flex gap-4 justify-center sm:justify-start mt-3">
//             <a
//               href={`mailto:${aboutUs.info.email}`}
//               className="flex items-center gap-2 text-green-700 hover:underline"
//             >
//               <Mail className="w-4 h-4" />
//               Email
//             </a>

//             <a
//               href={aboutUs.info.linkedin}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-green-700 hover:underline"
//             >
//               <Linkedin className="w-4 h-4" />
//               LinkedIn
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[1280px]">
//         <Value title="♻️ Our Vision" text={aboutUs.ourVision} />
//         <Value title="🚛 Smart Scrap Pickup" text={aboutUs.smartPickup} />
//         <Value title="💚 Sustainability First" text={aboutUs.sustainability} />
//         <Value title="🤝 Community Impact" text={aboutUs.communityImpact} />
//       </section>

//       {/* Footer */}
//       <footer className="mt-10 text-center pb-4 text-gray-600 text-sm border-t border-gray-200 pt-4">
//         © {new Date().getFullYear()}{" "}
//         <span className="font-semibold text-green-700">
//           {aboutUs.info.company}
//         </span>
//         . All Rights Reserved.
//       </footer>
//     </main>
//   );
// }

// function Value({ title, text }: { title: string; text: string }) {
//   return (
//     <div className="bg-green-50 rounded-2xl p-5 sm:p-7 hover:shadow-lg transition-all">
//       <h3 className="text-xl font-semibold text-green-800 mb-2">
//         {title}
//       </h3>
//       <p className="text-gray-700 leading-relaxed">{text}</p>
//     </div>
//   );
// }
