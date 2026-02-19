
// import BottomCartBar from "./Home/BottomCartBar";
import ProfileCard from "./CommonCode/UiCode/topBar"
import ContactHelp from "./CommonCode/UiCode/contactHelp"
// import Offers from "./CommonCode/UiCode/offers"
import DailyScrapsSection from './Home/homeComp'

import ActionButtons from './Home/actionButton'
import SearchScrap from './Home/search'
import CustomOrderForm from "./Home/customOrder"
import AuthGuard from "./CommonCode/auth/authGaurd"
import SlidingInfoBar from "./CommonCode/UiCode/helpBar"
import ElectronicsWasteSection from "./Home/eScrapPage"
// import GlobalLoader from "./CommonCode/UiCode/GlobalLoader" // for testing

export const metadata = {
  title: "B Tech Kabadiwala | Scrap Pickup Service in Kanpur",
  description:
    "Doorstep scrap pickup in Kanpur. Sell paper, iron, plastic, e-waste at best prices. Call or WhatsApp 7518315870.",
};


export default function Home() {
  const offerMsg = `Get extra ₹3 per kg on 20 kg + of
        scrap in a single order`;

 return (
    <main className=" mx-auto pb-32 h-[calc(100vh-56px)] gap-y-3 overflow-y-auto scrollbar-hide bg-zinc-100">
      <AuthGuard>
        <ProfileCard/>
        <ContactHelp/>
        {/* <GlobalLoader isLoading={true} /> */}
        {/* <Offers offerMsg={offerMsg} /> */}
        <SlidingInfoBar />
        <SearchScrap />
        <CustomOrderForm />
        <DailyScrapsSection />
        <ElectronicsWasteSection/>
        <ActionButtons />
      </AuthGuard>
    </main>
  );
}

