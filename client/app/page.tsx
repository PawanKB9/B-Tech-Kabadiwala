
// import BottomCartBar from "./Home/BottomCartBar";
import ProfileCard from "./ComonCode/UiCode/topBar"
import ContactHelp from "./ComonCode/UiCode/contactHelp"
import Offers from "./ComonCode/UiCode/offers"
import DailyScrapsSection from './Home/homeComp'

import ActionButtons from './Home/actionButton'
import SearchScrap from './Home/search'
import AdSidebar from "./ComonCode/UiCode/advertisement"
import ElectronicsWasteSection from "./Home/eScrapPage"
import CustomOrderForm from "./Home/customOrder"


export default function Home() {
  const offerMsg = `Get extra ₹3 per kg on 20 kg + of
        scrap in a single order`;

 return (
    <main className=" mx-auto pb-32 h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide bg-zinc-100"> 
      <ProfileCard/>
      <ContactHelp/>
      <Offers offerMsg={offerMsg} />
      <SearchScrap />
      <CustomOrderForm />
      <DailyScrapsSection />
      {/* <DailyScrapsSection /> */}
      <ElectronicsWasteSection />
      <ActionButtons />
    </main>
  );
}

