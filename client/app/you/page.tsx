
import AdSidebar from "../ComonCode/UiCode/advertisement";
import ContactHelp from "../ComonCode/UiCode/contactHelp";
import ProfileCard from "../ComonCode/UiCode/topBar";
import AboutUs from "./aboutus/page";
import BatchCard from "./batch";
import AppExperienceFeedback from "./appfeedback/page";
import HelpCenter from "./help/page";
import PoliciesAgreement from "./terms&policy/page";
import UpdateUserInfo from "./updateInfo";
import YouNavigation from "./youNav";
import { ChevronDown, ChevronUp } from "lucide-react";

const batchs = [
    {
        img_url : "/il_340x270.2832384630_jgjz.jpg",
        name : "Green Batch"
    },
    {
        img_url : "/gettyimages-165609464-612x612.jpg",
        name : "Gold Batch"
    },
    {
        img_url : "/istockphoto-1177313720-612x612.jpg",
        name : "Rupee Batch"
    },
    {
        img_url : "/currency_india.jpg",
        name : "India Batch"
    }
]
export default function YouPage() {

    return (
        <main className="bg-zinc-100  h-[calc(100vh-56px)] pb-14 overflow-y-auto scrollbar-hide">
            <div className=" p-1 flex flex-col mx-auto gap-6 max-w-3xl">
                <ProfileCard />
            
            {/* TOTAL EARNING BOX */}
            <div className="w-full  mb-6 text-lg flex gap-[7%] sm:gap-[12%] [@media(min-width:320px)]:text-xl font-bold justify-between p-2 items-center  rounded-2xl">
            <div className="bg-green-800 text-white w-[50%] p-3 rounded-xl">
                <div>Total Earned</div>
                <div>$5000</div>
            </div>
            <div className="bg-green-800 text-white w-[50%] p-3 rounded-xl">
                <div>This Month</div>
                <div>$300</div>
            </div>
            </div>

            {/* <div>
                <div
                className={`flex gap-4 sm:gap-6 justify-start overflow-x-auto scrollbar-hide transition-all duration-300`}
                >
                {batchs.map((item, i) => (
                    <div key={i} className=" flex-shrink-0 ">
                    <BatchCard {...item} />
                    </div>
                ))}
                </div>
            </div> */}

            <ContactHelp />
            <YouNavigation />
            </div>
            {/* <UpdateUserInfo /> */}
        </main>
    );
}