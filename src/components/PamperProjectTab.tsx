import React, { useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  Gift, 
  Printer, 
  DollarSign, 
  CheckCircle, 
  Heart, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Shield, 
  Flame, 
  VolumeX, 
  Smile, 
  BookOpen, 
  Users, 
  ThumbsUp, 
  Info,
  Sliders,
  Send,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LLCConfig } from "../types";

interface PamperProjectTabProps {
  llc: LLCConfig;
}

interface Service {
  id: string;
  title: string;
  duration: number; // in minutes
  suggestedPrice: number;
  description: string;
  isKansasCompliant: boolean;
}

export default function PamperProjectTab({ llc }: PamperProjectTabProps) {
  // Configurable states that update the slides live
  const [presenterName, setPresenterName] = useState("Scout Yeshua");
  const [locationCity, setLocationCity] = useState("Lawrence, Kansas");
  const [partnerChurch, setPartnerChurch] = useState("First United Methodist");
  const [partnerCoffee, setPartnerCoffee] = useState("Decade Coffee");
  const [deckTheme, setDeckTheme] = useState<"warm-lavender" | "earthy-sand" | "sage-green">("warm-lavender");
  
  // Customizable core services
  const [services, setServices] = useState<Service[]>([
    {
      id: "srv-1",
      title: "Hand & Foot Reset",
      duration: 30,
      suggestedPrice: 30,
      description: "Warm herbal compresses, certified organic cold-pressed oil massage, and physical tension release. Perfect for elder neighbors or high-stress shifts.",
      isKansasCompliant: true
    },
    {
      id: "srv-2",
      title: "Shoulder & Neck Release",
      duration: 25,
      suggestedPrice: 25,
      description: "Focused non-medical pressure point relief, heated flaxseed collar wrap, and guided deep-breathing rhythms. Clears desk fatigue instantly.",
      isKansasCompliant: true
    },
    {
      id: "srv-3",
      title: "Guided Facial Glow",
      duration: 40,
      suggestedPrice: 40,
      description: "Cool rosewater sweep, delicate face massage (absolutely no extractions or medical peeling), lavender hot steam towels, and restorative facial oil.",
      isKansasCompliant: true
    }
  ]);

  // Editing state for services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState(30);
  const [editPrice, setEditPrice] = useState(30);
  const [editDesc, setEditDesc] = useState("");

  // Start editing helper
  const startEditing = (srv: Service) => {
    setEditingServiceId(srv.id);
    setEditTitle(srv.title);
    setEditDuration(srv.duration);
    setEditPrice(srv.suggestedPrice);
    setEditDesc(srv.description);
  };

  // Save service modification
  const saveServiceEdit = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? {
      ...s,
      title: editTitle,
      duration: editDuration,
      suggestedPrice: editPrice,
      description: editDesc
    } : s));
    setEditingServiceId(null);
  };

  // Add customized service slot
  const handleAddNewService = () => {
    const newId = `srv-${Date.now()}`;
    const newSrv: Service = {
      id: newId,
      title: "Custom Relax Treatment",
      duration: 30,
      suggestedPrice: 35,
      description: "Neighborly soothing touch, clean non-medical pressure release, and warm natural aromas tailored for your home space.",
      isKansasCompliant: true
    };
    setServices(prev => [...prev, newSrv]);
    startEditing(newSrv);
  };

  // Delete service helper
  const handleDeleteService = (id: string) => {
    if (services.length <= 1) {
      alert("Please keep at least one active pamper service on your menu.");
      return;
    }
    setServices(prev => prev.filter(s => s.id !== id));
    if (editingServiceId === id) setEditingServiceId(null);
  };

  // Interactive slider states for startup budget calculator
  const [massageTableCost, setMassageTableCost] = useState(140);
  const [linensBlanketsCost, setLinensBlanketsCost] = useState(120);
  const [towelsWarmerCost, setTowelsWarmerCost] = useState(90);
  const [quietKitCost, setQuietKitCost] = useState(70); // oils, speaker, towels, cooler
  const [incidentalsCost, setIncidentalsCost] = useState(80);

  const totalStartupCost = massageTableCost + linensBlanketsCost + towelsWarmerCost + quietKitCost + incidentalsCost;

  // Slide Deck navigation
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 10;

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Interactive Gift Card Generator State
  const [giftTo, setGiftTo] = useState("Sarah Miller");
  const [giftFrom, setGiftFrom] = useState("The Lawrence neighbors");
  const [giftService, setGiftService] = useState(services[0]?.title || "Hand & Foot Reset");
  const [giftNote, setGiftNote] = useState("Sending you peace after your busy nursing shift. Rest well!");
  const [showGiftNotification, setShowGiftNotification] = useState(false);

  const handlePrintMenu = () => {
    window.print();
  };

  // Theme styling configurations for the interactive slide preview
  const themeStyles = {
    "warm-lavender": {
      bg: "bg-[#f5eefb]",
      text: "text-stone-850",
      accent: "text-purple-750",
      accentBg: "bg-purple-100",
      border: "border-purple-200",
      cardBg: "bg-white",
      highlight: "#7c3aed",
      gradient: "from-purple-50 via-purple-100/40 to-white",
      phoneThemeBorder: "border-purple-900/10",
      textColorDark: "text-purple-950"
    },
    "earthy-sand": {
      bg: "bg-[#f7f3eb]",
      text: "text-stone-850",
      accent: "text-amber-800",
      accentBg: "bg-amber-100",
      border: "border-amber-200",
      cardBg: "bg-white",
      highlight: "#b45309",
      gradient: "from-amber-50 via-amber-100/40 to-white",
      phoneThemeBorder: "border-amber-900/10",
      textColorDark: "text-stone-900"
    },
    "sage-green": {
      bg: "bg-[#f1f5f0]",
      text: "text-stone-850",
      accent: "text-emerald-800",
      accentBg: "bg-emerald-100",
      border: "border-emerald-250",
      cardBg: "bg-white",
      highlight: "#047857",
      gradient: "from-emerald-50 via-emerald-100/40 to-white",
      phoneThemeBorder: "border-emerald-900/10",
      textColorDark: "text-emerald-950"
    }
  };

  const activeTheme = themeStyles[deckTheme];

  // The 10-slide content generator
  const getSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="h-full flex flex-col justify-between p-6 md:p-8 text-center">
            <div className="space-y-4 my-auto">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-stone-950/5 border border-stone-900/10 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059]">
                  A Neighborly Initiative
                </span>
              </div>
              <h1 className="font-serif italic text-3xl md:text-4xl text-stone-900 tracking-tight leading-tight">
                The Neighborly <br />
                <span className="font-sans not-italic font-semibold text-2xl text-stone-800 block mt-1">Pamper Project</span>
              </h1>
              <p className="text-xs text-stone-550 max-w-xs mx-auto italic font-serif">
                "Warm, non-medical corporate stewardship built for Lawrence living rooms & backyards, priced like a gift."
              </p>
            </div>
            <div className="border-t border-stone-200/60 pt-4 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Presented by</p>
              <p className="text-xs font-semibold text-stone-800 mt-0.5">{presenterName}</p>
              <p className="text-[9px] text-[#c5a059] font-mono mt-0.5 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" /> {locationCity}
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 2 // The Problem</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Stress of Daily Labor is Sky-High</h2>
            </div>
            
            <div className="space-y-4 my-auto">
              <div className="p-4 bg-stone-950/[0.02] border border-stone-200/50 rounded-sm">
                <p className="text-xs text-stone-600 font-serif leading-relaxed italic">
                  "Traditional spas take weeks to book. They cost upwards of $150+, require stressful traffic driving, and feel like exclusive corporate luxury rather than cozy, humble rest."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-red-50 border border-red-100 rounded">
                  <span className="block font-serif text-lg font-bold text-red-700">92%</span>
                  <span className="text-[9px] font-mono text-stone-500 uppercase">Parent & Career Burnout</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-150 rounded">
                  <span className="block font-serif text-lg font-bold text-amber-800">$175+</span>
                  <span className="text-[9px] font-mono text-stone-500 uppercase">Average Resort Spa Cost</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              No drive-time. No massive overhead. Simple rest.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 3 // The Market Shift</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Calm is Migrating to the Home Door</h2>
            </div>

            <div className="space-y-3 my-auto">
              <p className="text-xs text-stone-600 leading-relaxed">
                The global paradigm shift has moved from complex clinical locations to direct-to-door comfort:
              </p>
              
              <div className="space-y-2">
                <div className="p-2.5 bg-white/70 border border-stone-150 rounded-sm flex items-start gap-2 text-[10px]">
                  <span className="w-4 h-4 bg-purple-500/10 text-purple-700 rounded-full flex items-center justify-center font-bold font-mono">1</span>
                  <div>
                    <span className="font-bold text-stone-850">Dubai & London</span>
                    <p className="text-stone-500 mt-0.5">Gentle Glow Homespa bringing direct-to-door premium table relaxes.</p>
                  </div>
                </div>
                <div className="p-2.5 bg-white/70 border border-stone-150 rounded-sm flex items-start gap-2 text-[10px]">
                  <span className="w-4 h-4 bg-amber-500/10 text-amber-700 rounded-full flex items-center justify-center font-bold font-mono">2</span>
                  <div>
                    <span className="font-bold text-stone-850">The Pamper Truck</span>
                    <p className="text-stone-500 mt-0.5">Mobile retro salon van drawing huge social engagement (13k+ likes).</p>
                  </div>
                </div>
                <div className="p-2.5 bg-white/70 border border-stone-150 rounded-sm flex items-start gap-2 text-[10px]">
                  <span className="w-4 h-4 bg-emerald-500/10 text-emerald-700 rounded-full flex items-center justify-center font-bold font-mono">3</span>
                  <div>
                    <span className="font-bold text-stone-850">YesMadam & Urban Company</span>
                    <p className="text-stone-500 mt-0.5">Proven on-demand scale proving clients prefer custom localized comfort.</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              "We relax fastest in our own cozy chair."
            </p>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 4 // The Noble Solution</span>
              <h2 className="font-serif italic text-2xl text-stone-900">A Personal Pamper Room to Go</h2>
            </div>

            <div className="my-auto space-y-3.5">
              <p className="text-xs text-stone-600 leading-relaxed">
                Rather than an expensive resort, we run a micro mobile service. We enter a cozy room and establish tranquility in under 15 minutes:
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-sm">
                  <span className="font-bold text-stone-800 block mb-1">Equipment Set</span>
                  <p className="text-stone-550 leading-tight">Foldable premium massage table, clean linens, electric stone warmer.</p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-sm">
                  <span className="font-bold text-stone-800 block mb-1">Tranquility Kit</span>
                  <p className="text-stone-550 leading-tight">Soothing room acoustics, botanical oils, safe lavender towels.</p>
                </div>
              </div>

              <div className="p-2 bg-emerald-50 border border-emerald-150 rounded-sm flex items-center gap-2 text-[10px]">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-emerald-800">State Legal: Fully Non-medical/no license necessary treatment menu.</span>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              No noise, no mess, no stress.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 5 // The Services Menu</span>
              <h2 className="font-serif italic text-2xl text-stone-900">3 Core Licensure-Free Offerings</h2>
            </div>

            <div className="space-y-2.5 my-auto max-h-[220px] overflow-y-auto pr-1">
              {services.map((srv, sIdx) => (
                <div key={srv.id} className="p-2.5 bg-white border border-stone-200/70 rounded-sm flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-serif font-bold text-stone-850 flex items-center gap-1.5 leading-tight">
                      <span className="w-4 h-4 rounded-full bg-stone-900 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                        {sIdx + 1}
                      </span>
                      {srv.title}
                    </span>
                    <p className="text-[9px] text-stone-500 leading-snug line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="text-right shrink-0 bg-stone-50 p-1 rounded border border-stone-100">
                    <span className="block font-mono text-[9px] text-[#c5a059] font-bold">${srv.suggestedPrice}</span>
                    <span className="block font-mono text-[8px] text-stone-400 font-semibold">{srv.duration} Min</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 bg-amber-50 border border-amber-100 rounded-sm text-center">
              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-850">
                ⭐ 100% compliant with Kansas Board of Healing Arts guidelines.
              </span>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 6 // How It Works</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Seamless Setup, Cozy & Peaceful</h2>
            </div>

            <div className="my-auto space-y-2 text-xs">
              <div className="relative pl-6">
                <span className="absolute left-0 top-0.5 font-mono text-stone-400 font-bold">01/</span>
                <span className="font-semibold text-stone-850">Text-to-Book</span>
                <p className="text-[10px] text-stone-500">Fast coordinate setup. Select the hand-foot reset, back neck release, or facial glow treatment.</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute left-0 top-0.5 font-mono text-stone-400 font-bold">02/</span>
                <span className="font-semibold text-stone-850">Pre-Tranquility Setup</span>
                <p className="text-[10px] text-stone-500">We arrive with table and oils. Perfect temperature setup inside 10 minutes in the living room or deck.</p>
              </div>

              <div className="relative pl-6">
                <span className="absolute left-0 top-0.5 font-mono text-stone-400 font-bold">03/</span>
                <span className="font-semibold text-stone-850">Clean Wipe Down & Exit</span>
                <p className="text-[10px] text-stone-500">All linens placed in a laundry container. No remaining clutter. A sweet handwritten thank-you card remains.</p>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              Perfect for gift-givers and busy parents.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 7 // Kind Economics</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Priced as a Gift, Not Luxury Spoils</h2>
            </div>

            <div className="my-auto space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-stone-950/[0.015] border border-stone-200/50 rounded-sm">
                  <Gift className="w-5 h-5 mx-auto text-[#c5a059] mb-1" />
                  <span className="font-bold text-stone-850 block">Suggested Scale</span>
                  <p className="text-[9px] text-stone-500 mt-1">Suggested pricing: $25 to $45 to keep startup material running.</p>
                </div>
                <div className="p-3 bg-stone-950/[0.015] border border-stone-200/50 rounded-sm">
                  <Coffee className="w-5 h-5 mx-auto text-[#c5a059] mb-1" />
                  <span className="font-bold text-stone-850 block">Sliding Slots</span>
                  <p className="text-[9px] text-stone-500 mt-1">Free or pay-what-you-can openings for elder neighbors or shift laborers.</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-55/40 border border-indigo-100 rounded text-[10px] text-stone-605">
                <p className="font-bold text-stone-800">Covenant Model:</p>
                Every two gift cards purchased directly sponsor one free rest treatment for a tired caretaker or hard worker.
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              Kindness as a practical business skill.
            </p>
          </div>
        );

      case 7:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 8 // Safety Standards</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Clear Protocols & Boundary Safety</h2>
            </div>

            <div className="my-auto space-y-2.5 text-[11px] text-stone-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">Cleanliness Protocol</span>
                  <p className="text-[9.5px] text-stone-500">Medical-grade anti-bacterial wipes. Linen sanitization under hot temperatures. 100% unscented oils options.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">Clear Boundaries</span>
                  <p className="text-[9.5px] text-stone-500">Fully non-medical treatments, strictly avoiding any adjustments or medical peeling. Always dressed comfortably.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800">Pre-session Intake</span>
                  <p className="text-[9.5px] text-stone-500">Short verbal agreement confirming focus areas, allergies, and environmental acoustics.</p>
                </div>
              </div>
            </div>

            <div className="p-2 bg-stone-950/[0.03] border border-stone-200/50 rounded-sm text-center text-[10px]">
              <span className="font-serif text-stone-600 italic">"Security represents the first layer of real care."</span>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 9 // Lawrence Pilot</span>
              <h2 className="font-serif italic text-2xl text-stone-900">Local Groundwork for Our Town</h2>
            </div>

            <div className="my-auto space-y-3.5 text-xs text-stone-650">
              <p>We are initiating the mobile room project within local limits, focusing on pilot communities:</p>
              
              <div className="space-y-2">
                <div className="p-2 bg-stone-100/50 border border-stone-200/50 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-semibold text-stone-800">3 Pilot Living Rooms</span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-450 uppercase">Weekends</span>
                </div>

                <div className="p-2 bg-stone-100/50 border border-stone-200/50 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-semibold text-stone-800">{partnerCoffee} Shop</span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-450 uppercase">Pop-Up Wellness</span>
                </div>

                <div className="p-2 bg-stone-100/50 border border-stone-200/50 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-semibold text-stone-800">{partnerChurch} Church</span>
                  </div>
                  <span className="text-[9px] font-mono text-stone-450 uppercase">Caretaker Rest</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-stone-400 text-center uppercase tracking-wider">
              Lawrence home living rooms & community hubs.
            </p>
          </div>
        );

      case 9:
        return (
          <div className="h-full flex flex-col justify-between p-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#c5a059] uppercase tracking-widest">Slide 10 // The Humble Request</span>
              <h2 className="font-serif italic text-2xl text-stone-900">To Begin This Labor of Kindness</h2>
            </div>

            <div className="my-auto space-y-3 text-xs leading-relaxed">
              <p className="text-stone-600 font-serif italic text-center">
                "I'm not trying to build a chain. I just like doing nice things, and I noticed people relax faster in their own chair."
              </p>

              <div className="bg-stone-900 text-stone-200 p-3 rounded-sm space-y-1.5 border border-stone-800">
                <span className="text-[8px] font-mono tracking-widest uppercase text-[#c5a059] block">What We Need:</span>
                <ul className="space-y-1 text-[10px] text-stone-300 font-mono">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                    3 Pilot Host Backyards/Living Rooms
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                    1 Volunteer Calendar Scheduler
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                    ${totalStartupCost} for Linens, Table, & Oils
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-200/60 pt-3 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] font-semibold">Join the Neighborly Project</p>
              <p className="text-[9px] text-stone-400 mt-0.5">Let's coordinate a session together.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="pamper-tab-container" className="space-y-8 pb-12 animate-slide-up">
      
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-sm">
              NEW INITIATIVE
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-700"></span>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Avodah Community Care</span>
          </div>
          <h2 className="font-serif italic text-2xl md:text-3xl text-stone-100 tracking-tight">The Neighborly Pamper Project</h2>
          <p className="text-xs text-stone-400 max-w-2xl">
            A beautiful, localized room-service pitch designed specifically for Lawrence, Kansas neighbors. Bring peace directly to people's living rooms, garages, or church fellowships for mutual aid and gentle resting.
          </p>
        </div>
        
        <div id="actions-panel" className="flex items-center gap-2">
          <button
            onClick={handlePrintMenu}
            className="px-4 py-2 text-xs font-mono bg-stone-900 border border-stone-800 hover:border-[#c5a059]/40 hover:bg-stone-850 text-stone-300 transition rounded-sm flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
            Print Care Menu
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simulated Phone Frame with Slide Deck */}
        <div className="xl:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] font-bold block mb-1">Interactive Presentation Simulator</span>
            <p className="text-[11px] text-stone-500">Perfect representation of what you show on your phone to neighbors.</p>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-3 bg-stone-950 p-2 border border-stone-850 rounded-sm text-xs">
            <span className="text-stone-500 font-mono text-[10px] uppercase">Deck Vibe:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDeckTheme("warm-lavender")}
                className={`w-4 h-4 rounded-full bg-purple-200 border-2 ${deckTheme === "warm-lavender" ? "border-[#c5a059] scale-110" : "border-transparent"}`}
                title="Warm Lavender"
              ></button>
              <button 
                onClick={() => setDeckTheme("earthy-sand")}
                className={`w-4 h-4 rounded-full bg-amber-100 border-2 ${deckTheme === "earthy-sand" ? "border-[#c5a059] scale-110" : "border-transparent"}`}
                title="Earthy Sand"
              ></button>
              <button 
                onClick={() => setDeckTheme("sage-green")}
                className={`w-4 h-4 rounded-full bg-emerald-100 border-2 ${deckTheme === "sage-green" ? "border-[#c5a059] scale-110" : "border-transparent"}`}
                title="Sage Green"
              ></button>
            </div>
          </div>

          {/* Phone Body Container */}
          <div className="relative w-[340px] h-[580px] bg-stone-950 rounded-[44px] shadow-2xl p-3 border-4 border-stone-800 flex flex-col justify-between overflow-hidden">
            {/* Phone Notch/Island */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-stone-900 rounded-full flex items-center justify-center z-30">
              <div className="w-12 h-1 bg-stone-950 rounded-full mb-1"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950/80 absolute right-4 mb-1"></div>
            </div>

            {/* Slide Body Screen representing the active theme */}
            <div className={`w-full h-full rounded-[34px] ${activeTheme.bg} transition-colors duration-500 relative flex flex-col justify-between pt-12 pb-5 overflow-hidden z-10 select-none border border-black/10`}>
              {/* Top status indicator bar */}
              <div className="absolute top-8 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-stone-500 select-none">
                <span>Avodah Care Network</span>
                <span>LAWRENCE, KS</span>
              </div>

              {/* Animated Slides View Container */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    {getSlideContent(currentSlide)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide Counter Dots or Navigation Indicators */}
              <div className="px-6 flex items-center justify-between z-20">
                <button 
                  onClick={handlePrevSlide}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalSlides }).map((_, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        sIdx === currentSlide 
                        ? "w-4 bg-stone-900" 
                        : "w-1 bg-stone-300"
                      }`}
                    ></div>
                  ))}
                </div>

                <button 
                  onClick={handleNextSlide}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-stone-700 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Home Button indicator bar on iOS style */}
            <div className="w-32 h-1 bg-stone-850 rounded-full mx-auto my-1 z-25 absolute bottom-1.5 left-1/2 transform -translate-x-1/2"></div>
          </div>

          <span className="text-[10px] font-mono text-stone-500">
            Swipeable / Slider Screen {currentSlide + 1} of {totalSlides}
          </span>
        </div>

        {/* Right Column: interactive customization, pricing sheets, budget planner */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Deck Customize Configuration Panel */}
          <div className="p-5 bg-stone-900 border border-stone-850 rounded-sm space-y-4">
            <h3 className="font-serif italic text-lg text-stone-200 flex items-center gap-2 pb-3 border-b border-stone-850">
              <Sliders className="w-4.5 h-4.5 text-[#c5a059]" />
              Tailor and Pitch Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-450 uppercase block">Your Presenter Name</label>
                <input
                  type="text"
                  value={presenterName}
                  onChange={(e) => setPresenterName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-450 uppercase block">Target Town / city</label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-450 uppercase block">Partner Church Fellowship</label>
                <input
                  type="text"
                  value={partnerChurch}
                  onChange={(e) => setPartnerChurch(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-stone-450 uppercase block">Partner Coffee Shop Hub</label>
                <input
                  type="text"
                  value={partnerCoffee}
                  onChange={(e) => setPartnerCoffee(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </div>

          {/* Interactive Services Manager */}
          <div className="p-5 bg-stone-900 border border-stone-850 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-850">
              <h3 className="font-serif italic text-lg text-stone-200">
                Manage Licensing-Free Services Menu
              </h3>
              <button
                onClick={handleAddNewService}
                className="px-2.5 py-1 text-[10px] font-mono bg-[#c5a059] hover:bg-[#c5a059]/90 text-black font-semibold rounded-sm tracking-tight cursor-pointer"
              >
                + Add Custom Service
              </button>
            </div>

            <p className="text-[11px] text-stone-450 leading-relaxed italic">
              *Under Kansas Healing Arts statutes, non-medical comfort touching like cold oil application, scalp soothing, and flaxseed thermal pressure is strictly free from complex medical licensing. No extractions, no prescription peeling, no physical chiropractic manipulation.
            </p>

            <div className="space-y-3">
              {services.map((srv, idx) => (
                <div 
                  key={srv.id}
                  className="p-3.5 bg-stone-950 border border-stone-850 hover:border-stone-800 rounded-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  {editingServiceId === srv.id ? (
                    // Editing Form
                    <div className="w-full space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase block">Service Treatment Title</label>
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-stone-900 text-stone-100 text-xs px-2 py-1 rounded border border-stone-750 w-full outline-none focus:border-[#c5a059]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase block">Duration (Minutes)</label>
                          <input 
                            type="number" 
                            value={editDuration}
                            onChange={(e) => setEditDuration(parseInt(e.target.value) || 30)}
                            className="bg-stone-900 text-stone-100 text-xs px-2 py-1 rounded border border-stone-750 w-full outline-none focus:border-[#c5a059]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-stone-500 uppercase block">Suggested Base Rate ($)</label>
                          <input 
                            type="number" 
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseInt(e.target.value) || 25)}
                            className="bg-stone-900 text-stone-100 text-xs px-2 py-1 rounded border border-stone-750 w-full outline-none focus:border-[#c5a059]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-500 uppercase block">Friendly Description</label>
                        <textarea 
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          rows={2}
                          className="bg-stone-900 text-stone-100 text-xs px-2 py-1 rounded border border-stone-750 w-full outline-none resize-none focus:border-[#c5a059]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 text-[10px] font-mono">
                        <button 
                          onClick={() => setEditingServiceId(null)}
                          className="px-2 py-1 text-stone-400 hover:text-stone-205 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveServiceEdit(srv.id)}
                          className="px-2.5 py-1 bg-[#c5a059] text-black rounded font-bold cursor-pointer"
                        >
                          Save Treatment
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display View
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-900 border border-stone-800 text-[10px] font-mono text-[#c5a059] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-serif italic font-medium text-stone-200 text-base">{srv.title}</span>
                          <span className="text-[9px] font-mono bg-emerald-900/20 text-emerald-500 border border-emerald-900/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            KS safe // non-med
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 leading-normal max-w-xl pl-7">
                          {srv.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 self-end md:self-start pl-7 md:pl-0">
                        <div className="text-right">
                          <span className="block font-mono text-sm text-[#c5a059] font-bold">${srv.suggestedPrice}</span>
                          <span className="block font-mono text-[10px] text-stone-500">{srv.duration} Mins</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <button 
                            onClick={() => startEditing(srv)}
                            className="px-2 py-1 bg-stone-900 border border-stone-850 text-stone-300 hover:text-stone-100 rounded-sm cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteService(srv.id)}
                            className="px-2 py-1 bg-stone-900 border border-stone-850 text-red-400 hover:text-red-300 rounded-sm hover:border-red-900/30 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Startup Gear Budget & Pricing Math */}
          <div className="p-5 bg-stone-900 border border-stone-850 rounded-sm space-y-4">
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-serif italic text-lg text-stone-200">
                Sovereign Mobile Startup Budget
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Traditional standard spas require $115,000+ to rent commercial suites, whereas a mobile savior gear table kits costs under $150–$500 total!
              </p>
            </div>

            <div className="space-y-4">
              {/* Sliders Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 bg-stone-950 p-3 border border-stone-850 rounded">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] uppercase">Foldable Massage Table</span>
                    <span className="text-stone-200 text-sm font-bold">${massageTableCost}</span>
                  </div>
                  <input 
                    type="range" 
                    min={60} 
                    max={300} 
                    value={massageTableCost}
                    onChange={(e) => setMassageTableCost(parseInt(e.target.value))}
                    className="w-full accent-[#c5a059]"
                  />
                  <span className="text-[8px] text-stone-550 block">High-density foam, certified wood structure, secure cords.</span>
                </div>

                <div className="space-y-1.5 bg-stone-950 p-3 border border-stone-850 rounded">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] uppercase">Premium Linens & Blanket</span>
                    <span className="text-stone-200 text-sm font-bold">${linensBlanketsCost}</span>
                  </div>
                  <input 
                    type="range" 
                    min={40} 
                    max={250} 
                    value={linensBlanketsCost}
                    onChange={(e) => setLinensBlanketsCost(parseInt(e.target.value))}
                    className="w-full accent-[#c5a059]"
                  />
                  <span className="text-[8px] text-stone-550 block">Hypoallergenic micro-cotton sheets, protective fleece top.</span>
                </div>

                <div className="space-y-1.5 bg-stone-950 p-3 border border-stone-850 rounded">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] uppercase">Towel Heat Warmer + Cooler</span>
                    <span className="text-stone-200 text-sm font-bold">${towelsWarmerCost}</span>
                  </div>
                  <input 
                    type="range" 
                    min={30} 
                    max={200} 
                    value={towelsWarmerCost}
                    onChange={(e) => setTowelsWarmerCost(parseInt(e.target.value))}
                    className="w-full accent-[#c5a059]"
                  />
                  <span className="text-[8px] text-stone-550 block">Insulated high-capacity battery steam warmer.</span>
                </div>

                <div className="space-y-1.5 bg-stone-950 p-3 border border-stone-850 rounded">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] uppercase">Botanical Oils Quiet Kit</span>
                    <span className="text-stone-200 text-sm font-bold">${quietKitCost}</span>
                  </div>
                  <input 
                    type="range" 
                    min={20} 
                    max={150} 
                    value={quietKitCost}
                    onChange={(e) => setQuietKitCost(parseInt(e.target.value))}
                    className="w-full accent-[#c5a059]"
                  />
                  <span className="text-[8px] text-stone-550 block">Cold-press unscented sesame & sweet almond, sound speaker.</span>
                </div>
              </div>

              {/* Total Calculation Output */}
              <div className="p-4 bg-stone-950 border border-stone-850 rounded flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-500">Calculated Gear Capital</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-serif italic text-stone-100 font-bold">${totalStartupCost}</span>
                    <span className="text-[10px] text-stone-400 font-mono">Suggested Starting Budget</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-400 leading-normal border-l border-stone-800 pl-4 max-w-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 inline mr-1" />
                  <span className="text-[#c5a059] font-bold">Safe Financial Threshold: </span>
                  You only need to schedule about <strong className="text-stone-200">{(totalStartupCost / (services[0]?.suggestedPrice || 30)).toFixed(1)}</strong> sessions of {services[0]?.title || "treatments"} to break even on start materials!
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Gift Card Creator Generator Section */}
          <div className="p-5 bg-[#121212] border-2 border-stone-800 rounded-sm space-y-6">
            <div className="border-b border-stone-850 pb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#c5a059]" />
              <div>
                <h3 className="font-serif italic text-lg text-stone-100 leading-tight">Interactive Neighbor Pamper Gift Card</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Write a card of sweet rest for a weary neighbor, nurse, parent, or elderly friend.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Form Input fields */}
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-stone-550 uppercase font-bold block">To: (Weary Recipient)</label>
                  <input
                    type="text"
                    value={giftTo}
                    onChange={(e) => setGiftTo(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded px-2.5 py-1.5 outline-none focus:border-[#c5a059]"
                    placeholder="Enter friend's name..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-stone-550 uppercase font-bold block">From: (Kind Donor)</label>
                  <input
                    type="text"
                    value={giftFrom}
                    onChange={(e) => setGiftFrom(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded px-2.5 py-1.5 outline-none focus:border-[#c5a059]"
                    placeholder="Enter your name..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-stone-550 uppercase font-bold block">A gift of choice:</label>
                  <select
                    value={giftService}
                    onChange={(e) => setGiftService(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded px-2.5 py-1.5 outline-none focus:border-[#c5a059]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title} ({s.duration} mins)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-stone-550 uppercase font-bold block">Handwritten Cozy Note</label>
                  <textarea
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    rows={2.5}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded px-2.5 py-1.5 outline-none resize-none focus:border-[#c5a059]"
                    placeholder="Write a sweet encouraging sentence..."
                  />
                </div>

                <button
                  onClick={() => {
                    setShowGiftNotification(true);
                    setTimeout(() => setShowGiftNotification(false), 3000);
                  }}
                  className="w-full py-2 bg-stone-900 border border-stone-800 hover:border-[#c5a059] text-stone-200 font-mono uppercase tracking-widest hover:text-white transition rounded text-[10px] cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#c5a059]" />
                  Issue Certificate Registry
                </button>
              </div>

              {/* Gift Card visual wrapper */}
              <div 
                className={`p-1.5 rounded border border-dashed border-[#c5a059]/40 ${activeTheme.bg} text-stone-800 flex flex-col justify-between h-[250px] relative shadow overflow-hidden`}
                id="printable-cozy-gift-card"
              >
                {/* Visual flower details */}
                <div className="absolute top-2 right-2 w-12 h-12 border-r border-t border-[#c5a059]/30 font-serif text-[8px] text-center italic font-light text-[#c5a059]">
                  care
                </div>
                <div className="absolute bottom-2 left-2 w-12 h-12 border-l border-b border-[#c5a059]/30"></div>

                <div className="space-y-1.5 text-center mt-3">
                  <span className="text-[8px] font-mono tracking-widest text-[#c5a059] font-bold block uppercase">
                    A COZY COOPERATIVE GIFT
                  </span>
                  <h4 className="font-serif italic text-lg leading-tight">The Neighborly Pamper Project</h4>
                  <p className="text-[7.5px] font-mono text-stone-450 uppercase space-x-1.5">
                    <span>Delivered at home</span>
                    <span>•</span>
                    <span>Lawrence kansas limits</span>
                  </p>
                </div>

                <div className="my-auto px-4 text-center space-y-2">
                  <p className="font-mono text-[9px] text-[#c5a059] tracking-wider uppercase font-semibold">
                    Valid for: <span className="text-stone-800 font-serif italic not-uppercase font-medium text-xs underline decoration-[#c5a059]/60">{giftService}</span>
                  </p>
                  
                  <p className="font-serif italic text-xs text-stone-600 leading-normal max-w-xs mx-auto line-clamp-3">
                    "{giftNote}"
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-stone-300 pt-1 px-3 text-[8.5px] font-mono text-stone-500 uppercase">
                  <div>
                    <span>To: </span>
                    <strong className="text-stone-800">{giftTo || "Anonymous"}</strong>
                  </div>
                  <div>
                    <span>From: </span>
                    <strong className="text-stone-800">{giftFrom || "A Neighbor"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated registration notification toast */}
            <AnimatePresence>
              {showGiftNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 bg-stone-950 border border-emerald-990/40 rounded flex items-center justify-between text-xs text-stone-300 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Gift card successfully logged in Avodah Ledger!
                  </span>
                  <span className="text-[10px] text-[#c5a059]">Ready to Print</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Secret Print-Only View styled specifically for thermal / ink paper printers */}
      <div className="hidden print:block bg-white text-black p-12 space-y-8 min-h-screen text-xs select-text">
        <div className="text-center space-y-3 pb-6 border-b border-stone-300">
          <h1 className="font-serif italic text-4xl font-bold leading-tight text-stone-900">The Neighborly Pamper Project</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-[#c5a059]">Warm Home Room Service • {locationCity}</p>
          <p className="font-serif text-sm italic max-w-lg mx-auto">
            "A labor of noble neighborly care and practical, non-licensable rest setup."
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif font-bold text-lg border-b border-stone-200 pb-1">Treatment Care Menu</h2>
          <div className="space-y-6 font-serif">
            {services.map((s, idx) => (
              <div key={s.id} className="space-y-2">
                <div className="flex justify-between items-baseline font-serif">
                  <span className="font-bold text-base font-serif">
                    {idx + 1}. {s.title} ({s.duration} mins)
                  </span>
                  <span className="font-mono font-bold text-base text-[#c5a059] border-b border-[#c5a059]/40">${s.suggestedPrice} suggested</span>
                </div>
                <p className="text-xs text-stone-600 max-w-2xl px-4 leading-relaxed font-sans">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="font-serif font-bold text-lg border-b border-stone-200 pb-1">Principles of Care & Standards</h2>
          <ul className="list-disc pl-5 space-y-1.5 font-sans text-xs text-stone-600">
            <li><strong>Suggested Scale:</strong> Suggesting $25 to $45 suggested rate representing pure material reimbursement. Elder sliding slots active.</li>
            <li><strong>Absolute Local Safety:</strong> Standardized multi-temperature sanitized sheet changes, professional non-medical pressure protocols.</li>
            <li><strong>Kansas BHAs Guidance:</strong> Strictly non-medical, local healing touch guidelines. We perform basic muscle resting.</li>
          </ul>
        </div>

        <div className="border-t-2 border-dashed border-stone-400 pt-8 mt-12 grid grid-cols-2 gap-8">
          <div className="border border-[#c5a059]/40 p-6 rounded space-y-4 flex flex-col justify-between h-[220px]">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono block">COZY COOPERATIVE GIFT CARD</span>
              <h3 className="font-serif italic text-lg leading-tight font-bold">The Neighborly Pamper Project</h3>
            </div>
            <div className="text-center font-serif py-4 mx-auto max-w-sm border-t border-b border-dashed border-stone-300">
              <span className="font-mono font-bold block text-sm text-[#c5a059]">For: {giftService}</span>
              <p className="italic text-xs mt-1 text-stone-600">"{giftNote}"</p>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span>To: {giftTo}</span>
              <span>From: {giftFrom}</span>
            </div>
          </div>

          <div className="space-y-4 font-sans text-[11px] text-stone-500 self-center">
            <p><strong>To Schedule a session:</strong> Simply text the organizer <strong>{presenterName}</strong> indicating your location in {locationCity}. Please coordinate safe, clean ventilation in the workspace.</p>
            <p>Thank you for coordinating active caring inside our beautiful town. Every paid purchase directly funds free sessions for careworkers and seniors.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
