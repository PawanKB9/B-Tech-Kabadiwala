
"use client";

import Image from "next/image";
import Offers from "../ComonCode/UiCode/offers";
import ScrapArticle from "./Article";
import HeroSlider from "./PosterSlider";
import PromoCard from "./quotes";
import AdSidebar from "../ComonCode/UiCode/advertisement";

const offerMsg = `Get extra ₹3 per kg on 20 kg + of scrap in a single order`;

const PlasticArticle = {
    title: "Plastic Recycling",
    content: [
        "Reduces greenhouse gases by up to 80%",
        '1 Ton of recycled plastic saves nearly 2 tons  of CO₂ emissions',
        "Recycling just 1 plastic bottle saves enough energy to power a light bulb for 6 hours.",
        "Producing new plastic uses up to 40% more energy",
        'Reduces oil dependency: Less need for petroleum-based plastic production'
    ]
}
const IronArticle = {
    title: "Recycling Metals",
    content: [
        "Reduces greenhouse gases by up to 80%",
        '1 Ton of Recycled steel saves 1.1 tons of iron ore and 0.6 tons of coal',
        "Recycled aluminum uses 95% less energy",
        "Supports sustainable ,  Reduces the Waste and Pollution!",
        
    ]
}
const PaperArticle = {
    title: "Paper/Carton Recycling",
    content: [
        "40% less energy and 30% less water",
        '1 Recycling 1 Ton of paper saves 17 trees and 26,000 liters of water',
        "Recycling 1 ton of paper  powers an average Indian home for 6 months",
        "Lowers greenhouse gas emissions, Reduces 25% landfill waste",
        "Recycled cardboard emits 50% less CO₂ than New",
    ]
}

const promoData = [
  {
    l1: "Promote Recycling",
    l2: "Protect Earth",
    image: "/istockphoto-185110991-612x612.jpg",
  },
  {
    l1: "Be the Part of",
    l2: "Better Society!",
    image: "/environmental-protection-trash-recycling-garbage-vector-42627483.jpg",
  }
];

export default function KnowledgeBase() {
  return (
    <main  className="w-full z-0 pb-6 bg-zinc-100  h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide mx-auto p-1">
      {/* Offer Section */}
      <Offers offerMsg={offerMsg} />

      {/* Image Articles */}
      <div className=" my-3">
          <HeroSlider />
      </div>

      <div className="flex flex-col sm:flex-row-reverse sm:justify-between lg:gap-[10%] gap-4 mt-4">
          {promoData.map((item, index) => (
              <PromoCard
              key={index}
              l1={item.l1}
              l2={item.l2}
              image={item.image}
              index={index}
              />
          ))}
      </div>

      {/* Article Section */}
      <div className="bento-grid">
        <div className="bento-a">
          <ScrapArticle articleData={IronArticle} />
        </div>
        <div className="bento-b">
          <ScrapArticle articleData={PlasticArticle} />
        </div>
        <div className="bento-c">
          <ScrapArticle articleData={PaperArticle} />
        </div>
      </div>
    </main>
  );
}
