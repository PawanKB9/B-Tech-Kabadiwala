import FacultyCard from "./FacultyCard";

const facultyData = [
  {
    name: "Vinod Kumar Yadav",
    designation: "HOD",
    department: "Humanities & Social Sciences",
    supportingRole:
      "Mentor and continuous strategic guidance for entrepreneurial growth.",
    image:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1770783257/vkyadav_ve7o03.jpg",
    isHighlighted: true,
  },
  {
    name: "Avinash Awadh",
    designation: "Guest Faculty",
    department: "Humanities & Social Sciences",
    supportingRole:
      "Financial Adviser providing structured financial planning and clarity.",
    image: "",
  },
  {
    name: "Bineeta Singh",
    designation: "Assistant Professor",
    department: "Chemical Engineering",
    supportingRole:
      "Guidance and motivational support for sustainable vision.",
    image:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1770783257/citations_ujlhbt.jpg",
  },
  {
    name: "Divya Somvanshi",
    designation: "Assistant Professor",
    department: "Physics",
    supportingRole:
      "Guidance and motivational support for sustainable vision.",
    image:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1770783257/divya_mam_h31uqz.jpg",
  },
  {
    name: "Soma Benerjee",
    designation: "Assistant Professor",
    department: "Plastic Technology",
    supportingRole:
      "Guidance and motivational support for sustainable vision.",
    image:
      "https://res.cloudinary.com/dtviazgmp/image/upload/v1770783257/Soma_mam_tghgns.jpg",
  },
];

export default function ThanksToFacultyPage() {
  return (
    <section className="relative min-h-screen bg-black text-white py-24 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_40%)]"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gratitude to Our Faculty
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Honoring the mentors of HBTU Kanpur whose guidance,
            encouragement, and belief shaped the foundation
            of this sustainable startup journey.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {facultyData.map((faculty, index) => (
            <FacultyCard
              key={index}
              name={faculty.name}
              designation={faculty.designation}
              department={faculty.department}
              supportingRole={faculty.supportingRole}
              image={faculty.image}
              isHighlighted={faculty.isHighlighted}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-32 text-center">
          <p className="text-gray-500 text-sm">
            Built with gratitude. Inspired at HBTU Kanpur.
          </p>
        </div>

      </div>
    </section>
  );
}
