import React from 'react';
import { ContactButtons } from '../common/ContactButtons';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onOrderNow: () => void;
  onOpenAdmin: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOrderNow, onOpenAdmin }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Hero Contact Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center font-extrabold text-xl mx-auto mb-4 shadow-sm">
          MES
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Muhammadi Egg Store
        </h1>
        <p className="text-sm font-semibold text-emerald-800 mt-1">
          Fresh Eggs Supplier
        </p>

        {/* Strict Service Area Banner */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Serving Loni, Ghaziabad, Uttar Pradesh</span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto mt-3 leading-relaxed">
          Daily supply of clean 100% white poultry eggs only (min. 50 trays), Britannia white bread (medium pack - min. 25 pieces), and regular buns in transparent 2-packs (min. 25 packs). Serving households, restaurants, bakeries, gyms, and commercial caterers across Loni.
        </p>

        {/* Primary Contact Details */}
        <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 inline-block text-left w-full max-w-md">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
            Official Store Contact
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>+91 639 2855 719</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Daily Supply Hours: 6:30 AM – 9:30 PM (All 7 Days)</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="tel:+916392855719"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Now</span>
          </a>

          <a
            href="https://wa.me/916392855719?text=Assalam-o-Alaikum%20Muhammadi%20Egg%20Store%2C%20I%20need%20egg%20supply%20in%20Loni."
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onOrderNow}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Order Now</span>
          </button>
        </div>
      </div>

      {/* Service Area Highlights & Assurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            Delivery Localities in Loni
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We deliver across all sectors and neighborhoods in Loni, including:
          </p>
          <div className="text-xs text-neutral-700 space-y-1 pt-1 font-medium">
            <p>• Sangam Vihar & Balram Nagar</p>
            <p>• Loni Border & Shiv Vihar Border Area</p>
            <p>• Tronica City & Industrial Kitchens</p>
            <p>• DLF Ankur Vihar & Khanna Nagar</p>
            <p>• Ashok Vihar & Indirapuri</p>
            <p>• Banthla & surrounding Loni localities</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Our Quality & Supply Guarantee
          </h3>
          <div className="text-xs text-neutral-600 space-y-2 leading-relaxed">
            <p>
              <strong className="text-neutral-900">Standard 30-Egg Trays:</strong> Every tray is packed with exactly 30 uniform, uncracked eggs in sturdy protective packaging.
            </p>
            <p>
              <strong className="text-neutral-900">Doorstep Verification:</strong> Check egg freshness and condition at delivery before paying via Cash or UPI.
            </p>
            <p>
              <strong className="text-neutral-900">Commercial Dependability:</strong> Early morning kitchen dispatch by 7:30 AM for restaurants, gyms & bakeries.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs divide-y divide-neutral-100">
          <div className="pt-2">
            <span className="font-bold text-neutral-900">What is the quantity in an Egg Tray?</span>
            <p className="text-neutral-600 mt-0.5">
              1 Egg Tray contains exactly 30 eggs. We also cater to custom packaging, loose packs (6 or 12 eggs), and multiple trays for bulk buyers.
            </p>
          </div>

          <div className="pt-2">
            <span className="font-bold text-neutral-900">How do I pay for my delivery?</span>
            <p className="text-neutral-600 mt-0.5">
              We offer Cash on Delivery (COD) as well as UPI payment on delivery. Our delivery boy carries a UPI QR scanner (PhonePe, GPay, Paytm).
            </p>
          </div>

          <div className="pt-2">
            <span className="font-bold text-neutral-900">Can I set up a daily egg delivery for my restaurant or gym?</span>
            <p className="text-neutral-600 mt-0.5">
              Yes! Use our "Bulk Orders" section or WhatsApp us directly at +91 639 2855 719 to arrange standing daily or alternate-day supply at wholesale rates.
            </p>
          </div>
        </div>
      </div>

      {/* Owner Login Link */}
      <div className="text-center pt-4">
        <button
          onClick={onOpenAdmin}
          className="text-xs text-neutral-400 hover:text-neutral-700 font-medium transition-colors"
        >
          Store Owner & Management Portal →
        </button>
      </div>
    </div>
  );
};
