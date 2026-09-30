import React, { useState } from 'react';
import { submitBulkOrder } from '../../services/api';
import { BulkOrderInquiry } from '../../types';
import { Building2, CheckCircle2, MessageCircle, Phone, Calendar, MapPin, Layers, AlertCircle, Loader2 } from 'lucide-react';

const TARGET_BUSINESSES = [
  'Households',
  'Restaurants',
  'Cafés',
  'Bakeries',
  'Gyms & Fitness Centers',
  'Caterers',
  'Messes & Hostels',
  'Food Stalls / Dhabas',
  'Wedding / Event Kitchens',
  'Institutional Kitchens',
];

const BULK_PRODUCTS = [
  'Fresh White Farm Egg Trays (Min 50 Trays - 1,500 White Eggs)',
  'Commercial White Egg Crates (Bulk Wholesale - White Eggs Only)',
  'Britannia White Bread Medium Packs (Min 25 Pieces)',
  'Regular 2-Buns Transparent Packs (Min 25 Packs / 50 Buns)',
  'Mixed Supply (White Eggs + Britannia Bread + Buns)',
];

export const BulkOrderSection: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [requiredProduct, setRequiredProduct] = useState(BULK_PRODUCTS[0]);
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [frequency, setFrequency] = useState('Daily Standing Supply');
  const [preferredDate, setPreferredDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<BulkOrderInquiry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !phone.trim() || !requiredQuantity.trim() || !deliveryLocation.trim()) {
      setError('Please fill in your name, phone number, required quantity, and delivery location in Loni.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const inquiry = await submitBulkOrder({
        customerName: customerName.trim(),
        businessName: (businessName.trim() || `${customerName}'s Kitchen`),
        businessType,
        phone: phone.trim(),
        whatsapp: sameAsPhone ? phone.trim() : (whatsapp.trim() || phone.trim()),
        requiredProduct,
        requiredQuantity: requiredQuantity.trim(),
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        deliveryLocation: `${deliveryLocation.trim()}, Loni`,
        frequency,
        additionalRequirements: additionalRequirements.trim(),
      });

      setSubmittedInquiry(inquiry);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to submit bulk supply request. Please WhatsApp Muhammadi Egg Store directly on +91 639 2855 719.'
      );
    } finally {
      setLoading(false);
    }
  };

  const forwardToWhatsApp = () => {
    if (!submittedInquiry) return;
    const msg = `*BULK SUPPLY INQUIRY - Muhammadi Egg Store*\n\n` +
      `*Inquiry ID:* ${submittedInquiry.id}\n` +
      `*Name:* ${submittedInquiry.customerName}\n` +
      `*Business:* ${submittedInquiry.businessName} (${submittedInquiry.businessType})\n` +
      `*Phone:* ${submittedInquiry.phone}\n` +
      `*Product:* ${submittedInquiry.requiredProduct}\n` +
      `*Quantity:* ${submittedInquiry.requiredQuantity}\n` +
      `*Frequency:* ${submittedInquiry.frequency}\n` +
      `*Location:* ${submittedInquiry.deliveryLocation}\n` +
      (submittedInquiry.additionalRequirements ? `*Notes:* ${submittedInquiry.additionalRequirements}\n` : '') +
      `\nPlease provide your wholesale rates and delivery schedule for Loni.`;

    window.open(`https://wa.me/916392855719?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Headline & Value Proposition */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
          Commercial & Bulk Supply
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 tracking-tight">
          Need eggs in bulk? We’ll handle the supply.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          Wholesale rates, verified daily farm freshness, and guaranteed early morning delivery across Loni, Ghaziabad. Zero tension for your kitchen operations.
        </p>

        {/* Target Businesses Grid */}
        <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-3xl mx-auto">
          {TARGET_BUSINESSES.map((b) => (
            <span
              key={b}
              className="text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-md shadow-2xs"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Submission Success State */}
      {submittedInquiry ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-neutral-900">Bulk Supply Request Submitted!</h3>
          <p className="text-xs text-neutral-600 mt-1">
            Reference ID: <span className="font-mono font-bold text-neutral-900">{submittedInquiry.id}</span>
          </p>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            Our team at Muhammadi Egg Store will review your kitchen requirements and contact you via phone/WhatsApp with custom wholesale pricing.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={forwardToWhatsApp}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Forward Request to Store WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmittedInquiry(null);
                setRequiredQuantity('');
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* The Bulk Order Form */
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contact Person Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Ahmad / Chef Rajesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Business / Kitchen Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Al-Naseeb Restaurant / FitZone Gym"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Business Category
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:outline-none"
                >
                  {TARGET_BUSINESSES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    disabled={sameAsPhone}
                    value={sameAsPhone ? phone : whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => setSameAsPhone(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700"
              />
              <span className="text-xs text-neutral-600">WhatsApp number same as phone</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Required Product <span className="text-rose-500">*</span>
                </label>
                <select
                  value={requiredProduct}
                  onChange={(e) => setRequiredProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:outline-none"
                >
                  {BULK_PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Quantity Required <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(e.target.value)}
                  placeholder="e.g. 20 Trays / 500 Eggs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Supply Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:outline-none"
                >
                  <option value="Daily Supply">Daily Morning Supply</option>
                  <option value="Alternate Days">Every 2 Days</option>
                  <option value="Weekly Twice">Twice a Week</option>
                  <option value="Weekly Supply">Weekly Once</option>
                  <option value="One-time Event">One-time Event / Wedding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Delivery Location in Loni <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Sangam Vihar / Tronica City / Loni Border"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Supply Start Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Additional Requirements / Specific Timings
              </label>
              <textarea
                rows={2}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="e.g. Need delivery before 7:30 AM, need invoice with GST, or specific packaging..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>Request Bulk Supply</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
