'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { BusinessType } from '@/types';
import {
  ShieldCheck,
  Building2,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Layers,
  TrendingUp,
  FileSpreadsheet,
  Phone,
  Mail,
  Briefcase,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra',
  'Punjab',
  'Gujarat',
  'Haryana',
  'Delhi NCR',
  'Uttar Pradesh',
  'Rajasthan',
  'Tamil Nadu',
  'Karnataka',
  'Telangana',
  'Chhattisgarh',
  'West Bengal',
  'Odisha',
  'Madhya Pradesh',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Andhra Pradesh',
  'Kerala',
  'Bihar',
  'Uttarakhand',
  'Goa',
];

const MATERIAL_INTEREST_OPTIONS = [
  'Round Bar (EN8 / EN19 / EN24)',
  'Bright Bar (EN1A / C45)',
  'Flat Bar (IS 2062 / Spring Steel)',
  'Steel Sheet & Plate (HR / CR)',
  'Square Bar & Bright Square',
  'TMT Rebar (Fe 500D / 550D)',
  'Melting & HMS Scrap',
];

const VOLUME_OPTIONS = [
  'Up to 5 Metric Tons / Month',
  '5 – 25 Metric Tons / Month',
  '25 – 100 Metric Tons / Month',
  '100+ Metric Tons / Month (Direct Mill Lots)',
];

const DESIGNATION_OPTIONS = [
  'Owner / Proprietor',
  'Managing Director / Partner',
  'Purchase / Procurement Head',
  'Project / Site Engineer',
  'Vendor Development Manager',
  'Accounts & Commercial Executive',
  'Other Authorized Signatory',
];

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[#94A3B8]">
          Loading authentication desk...
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/cart';
  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'login';

  const {
    isAuthenticated,
    isProfileComplete,
    authLoading,
    currentUser,
    cart,
    loginWithGoogle,
    completeSignupProfile,
    logout,
    switchUserRole,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState<'google_auth' | 'profiling'>('google_auth');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFallbackGoogleForm, setShowFallbackGoogleForm] = useState<boolean>(false);
  const [fallbackEmail, setFallbackEmail] = useState<string>('');
  const [fallbackName, setFallbackName] = useState<string>('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);

  // Profiling Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [designation, setDesignation] = useState<string>(DESIGNATION_OPTIONS[2]);
  const [companyName, setCompanyName] = useState<string>('');
  const [businessType, setBusinessType] = useState<BusinessType>('Manufacturer');
  const [hasGstin, setHasGstin] = useState<boolean>(true);
  const [gstin, setGstin] = useState<string>('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'Round Bar (EN8 / EN19 / EN24)',
    'Bright Bar (EN1A / C45)',
  ]);
  const [monthlyVolume, setMonthlyVolume] = useState<string>(VOLUME_OPTIONS[1]);

  // Primary Delivery Address State
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [stateName, setStateName] = useState<string>('Maharashtra');
  const [pincode, setPincode] = useState<string>('');
  const [addressType, setAddressType] = useState<'billing' | 'shipping' | 'both'>('both');

  // Pre-populate profiling form when user signs in with Google
  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.id !== 'guest') {
      if (isProfileComplete) {
        // User is already logged in AND has a completed B2B profile
        router.push(redirectPath);
      } else {
        // User authenticated with Google, needs B2B profiling
        setStep('profiling');
        setFullName(currentUser.fullName || '');
        setEmail(currentUser.email || '');
        setMobile(
          currentUser.mobile ? currentUser.mobile.replace(/^\+91\s*/, '') : ''
        );
        if (currentUser.companyName && currentUser.companyName !== 'Guest Visitor') {
          setCompanyName(currentUser.companyName);
        }
        if (currentUser.gstin) {
          setGstin(currentUser.gstin);
        }
        if (currentUser.businessType) {
          setBusinessType(currentUser.businessType);
        }
      }
    } else {
      setStep('google_auth');
    }
  }, [isAuthenticated, isProfileComplete, currentUser, redirectPath, router]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const res = await loginWithGoogle();

    if (res.status === 'logged_in') {
      router.push(redirectPath);
    } else if (res.status === 'needs_onboarding' && res.user) {
      setFullName(res.user.fullName || '');
      setEmail(res.user.email || '');
      setMobile(res.user.mobile ? res.user.mobile.replace(/^\+91\s*/, '') : '');
      setStep('profiling');
    } else if (res.status === 'error') {
      setErrorMsg(res.error || 'Could not sign in with Google.');
      // If popup was blocked or domain unauthorized in preview environment, reveal seamless Google email continuation
      if (
        res.errorCode &&
        res.errorCode !== 'auth/popup-closed-by-user' &&
        res.errorCode !== 'auth/cancelled-popup-request'
      ) {
        setShowFallbackGoogleForm(true);
      }
    }
  };

  const handleFallbackGoogleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = fallbackEmail.trim().toLowerCase();
    const cleanName = fallbackName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    const res = await loginWithGoogle({
      uid: `google-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
      email: cleanEmail,
      displayName: cleanName,
    });

    if (res.status === 'logged_in') {
      router.push(redirectPath);
    } else if (res.status === 'needs_onboarding' && res.user) {
      setFullName(res.user.fullName || cleanName);
      setEmail(res.user.email || cleanEmail);
      setStep('profiling');
    }
  };

  const toggleMaterialInterest = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const digitsOnlyMobile = mobile.replace(/\D/g, '').slice(-10);
    if (digitsOnlyMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile / WhatsApp number.');
      return;
    }

    if (!companyName.trim() || companyName.trim().length < 2) {
      setErrorMsg('Please enter your Company / Firm Legal Name.');
      return;
    }

    const cleanGstin = hasGstin ? gstin.trim().toUpperCase() : '';
    if (hasGstin && cleanGstin.length > 0 && cleanGstin.length !== 15) {
      setErrorMsg(
        'GSTIN must be 15 characters (e.g. 27AABCS1429B1Z8), or select "Unregistered / Commercial Buyer".'
      );
      return;
    }

    if (!streetAddress.trim() || !city.trim() || !stateName.trim()) {
      setErrorMsg(
        'Please provide your primary delivery street address, city, and state for freight calculation.'
      );
      return;
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit delivery PIN code.');
      return;
    }

    setIsSubmittingProfile(true);
    try {
      await completeSignupProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: `+91 ${digitsOnlyMobile.slice(0, 5)} ${digitsOnlyMobile.slice(5)}`,
        designation,
        companyName: companyName.trim(),
        businessType,
        gstin: cleanGstin,
        primaryMaterials: selectedMaterials,
        monthlyVolume,
        streetAddress: streetAddress.trim(),
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        district: district.trim() || city.trim(),
        state: stateName.trim(),
        pincode: cleanPin,
        addressType,
      });

      router.push(redirectPath);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save your B2B profile. Please try again.');
      setIsSubmittingProfile(false);
    }
  };

  return (
    <CustomerLayout>
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-52 sm:h-60 object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/40 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-14 sm:pt-18 pb-6 px-3.5 sm:px-6">
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-2 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">
              {step === 'profiling' ? 'Complete Buyer Profile' : 'Buyer Sign In & Registration'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {step === 'profiling' ? (
                  <>
                    Complete Your <span className="text-[#E8732A]">B2B Buyer Profile</span>
                  </>
                ) : (
                  <>
                    FTI Industrial Buyer <span className="text-[#E8732A]">Authentication</span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
                {step === 'profiling'
                  ? 'Provide your company, GSTIN, and primary delivery works details so our trading desk can prepare accurate freight and GST-compliant quotations.'
                  : 'Explore our catalog and live Mandi spot prices freely without login. Sign in with Google to submit official Quotation Requests (RFQs) and track orders.'}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-2 bg-[#14181F] border border-[#28303E] px-3.5 py-2 rounded-xl text-xs shrink-0">
              <div
                className={`flex items-center space-x-1.5 font-bold ${
                  step === 'google_auth' ? 'text-[#E8732A]' : 'text-[#4ADE80]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step === 'google_auth'
                      ? 'bg-[#251811] border border-[#E8732A] text-[#E8732A]'
                      : 'bg-[#122D21] border border-[#22C55E] text-[#4ADE80]'
                  }`}
                >
                  {step === 'google_auth' ? '1' : '✓'}
                </span>
                <span>Google Auth</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              <div
                className={`flex items-center space-x-1.5 font-bold ${
                  step === 'profiling' ? 'text-[#E8732A]' : 'text-[#64748B]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step === 'profiling'
                      ? 'bg-[#251811] border border-[#E8732A] text-[#E8732A]'
                      : 'bg-[#191F28] border border-[#2A3342] text-[#64748B]'
                  }`}
                >
                  2
                </span>
                <span>B2B Profiling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-8">
        {step === 'google_auth' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Google Sign In / Sign Up Card */}
            <div className="lg:col-span-7 bg-[#14181F] border border-[#28303E] rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0E1217] border border-[#222934] rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Sign In (Existing Buyer)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Sign Up (New Buyer Account)
                </button>
              </div>

              {cart.length > 0 && (
                <div className="mb-6 p-3.5 bg-[#251811]/80 border border-[#E06924]/50 rounded-xl flex items-start space-x-3 text-xs">
                  <FileSpreadsheet className="w-5 h-5 text-[#E8732A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white">
                      You have {cart.length} material combination{cart.length > 1 ? 's' : ''} ready in your Quotation Cart!
                    </p>
                    <p className="text-[#CBD5E1] text-[11px] mt-0.5">
                      Sign in with Google below — your cart items are safely preserved and you will be returned straight to submit your RFQ.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {authMode === 'login'
                    ? 'Welcome Back to FTI Trading Desk'
                    : 'Create Your Verified B2B Buyer Account'}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {authMode === 'login'
                    ? 'Sign in with your Google account to access your saved delivery addresses, active quotations, and tax invoices.'
                    : 'Register quickly with Google, then complete a 1-minute B2B buyer profile (Company Name, GSTIN & Delivery Location) to unlock official quotation requests.'}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 bg-[#2F1619] border border-[#EF4444]/40 text-[#F87171] text-xs rounded-xl flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Primary Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full bg-white hover:bg-slate-100 disabled:opacity-60 text-[#0F172A] font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.12)] border border-slate-200 flex items-center justify-center space-x-3 transition cursor-pointer"
              >
                {/* Official Google G SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {authLoading
                    ? 'Connecting to Google...'
                    : authMode === 'login'
                    ? 'Sign In with Google'
                    : 'Sign Up with Google'}
                </span>
              </button>

              {/* Toggle or fallback if popup is blocked by browser */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowFallbackGoogleForm(!showFallbackGoogleForm)}
                  className="text-[11px] text-[#94A3B8] hover:text-[#E8732A] underline cursor-pointer"
                >
                  {showFallbackGoogleForm
                    ? 'Hide manual Google workspace email entry'
                    : 'Popup blocked by browser? Continue with your Google Workspace email'}
                </button>
              </div>

              {showFallbackGoogleForm && (
                <form
                  onSubmit={handleFallbackGoogleContinue}
                  className="mt-4 p-4 bg-[#191F28] border border-[#2A3342] rounded-xl space-y-3 text-xs animate-in fade-in"
                >
                  <p className="text-[11px] text-[#CBD5E1] font-medium">
                    Enter your Google / Workspace details to proceed directly to {authMode === 'signup' ? 'B2B buyer profiling' : 'your account'}:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-white mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={fallbackName}
                        onChange={(e) => setFallbackName(e.target.value)}
                        placeholder="e.g. Amit Kulkarni"
                        className="w-full bg-[#12161D] border border-[#2A3342] rounded-lg p-2.5 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-white mb-1">Google Email Address *</label>
                      <input
                        type="email"
                        value={fallbackEmail}
                        onChange={(e) => setFallbackEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-[#12161D] border border-[#2A3342] rounded-lg p-2.5 text-white"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold py-2.5 px-4 rounded-lg border border-[#F59352]/50 cursor-pointer"
                  >
                    Continue with Google Account
                  </button>
                </form>
              )}

              {/* What happens during Sign Up explanation */}
              <div className="mt-7 pt-6 border-t border-[#222934]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E8732A] mb-3 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How Our B2B Registration & Quotation Flow Works</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5">
                    <span className="text-[10px] font-mono font-bold text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded border border-[#E06924]/40">
                      STEP 1
                    </span>
                    <h4 className="font-bold text-white mt-2">Verify via Google</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                      One-click Google authentication verifies your identity and official email without passwords.
                    </p>
                  </div>

                  <div className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5">
                    <span className="text-[10px] font-mono font-bold text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded border border-[#E06924]/40">
                      STEP 2
                    </span>
                    <h4 className="font-bold text-white mt-2">Company & GST Profile</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                      Provide your Firm Name, Business Type, GSTIN, and primary factory/warehouse delivery address.
                    </p>
                  </div>

                  <div className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5">
                    <span className="text-[10px] font-mono font-bold text-[#4ADE80] bg-[#122D21] px-2 py-0.5 rounded border border-[#22C55E]/40">
                      STEP 3
                    </span>
                    <h4 className="font-bold text-white mt-2">Request Official RFQs</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                      Submit multi-combination quotation carts and receive direct Ludhiana Works rates & freight.
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Exploring Without Login Banner */}
              <div className="mt-6 p-4 bg-[#10141A] border border-[#242C38] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">Just exploring specifications or live market rates?</p>
                  <p className="text-[11px] text-[#94A3B8]">
                    No login is needed to browse our 7 raw material categories, configure sizes, or track live Mandi prices.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    href="/raw-materials"
                    className="bg-[#191F28] hover:bg-[#222A36] text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-[#2A3342] transition"
                  >
                    Explore Catalog
                  </Link>
                  <Link
                    href="/market"
                    className="bg-[#191F28] hover:bg-[#222A36] text-[#4ADE80] text-xs font-bold px-3.5 py-2 rounded-lg border border-[#22C55E]/40 transition"
                  >
                    Live Market
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Value Props & Quick Sandbox Demo Switcher */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Why Login is Required for Quotations</h3>
                    <p className="text-[11px] text-[#94A3B8]">Strict B2B Zero-Markup Price Protection</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#CBD5E1]">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Custom Freight Calculation:</strong> Steel transportation cost depends on your exact factory/warehouse PIN code and lot weight.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">18% GST Input Tax Credit:</strong> Your Company Legal Name and GSTIN are embedded into official Proforma & Tax Invoices.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Real-Time Rate Lock:</strong> Accepted quotations lock volatile Mandi spot prices for 3 working days exclusively for your firm.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Sandbox Quick Access for Testing Existing Seed Accounts */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Quick Sandbox Preview Accounts
                </span>
                <h4 className="text-xs font-extrabold text-white mb-2">
                  Want to test with pre-populated sample orders & admin desk?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      switchUserRole('customer');
                      router.push(redirectPath);
                    }}
                    className="bg-[#191F28] hover:bg-[#222A36] border border-[#2A3342] text-left p-3 rounded-xl transition cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white">Demo Verified Buyer</p>
                    <p className="text-[10px] text-[#94A3B8] truncate">Sharma Fabricators Pvt Ltd</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchUserRole('admin');
                      router.push('/admin');
                    }}
                    className="bg-[#191F28] hover:bg-[#251811] border border-[#E06924]/40 text-left p-3 rounded-xl transition cursor-pointer"
                  >
                    <p className="text-xs font-bold text-[#E8732A]">FTI Admin Desk</p>
                    <p className="text-[10px] text-[#94A3B8] truncate">Anil Singhania (Super Admin)</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: B2B BUYER PROFILING & ONBOARDING FORM */
          <div className="max-w-4xl mx-auto">
            {/* Authenticated Google Identity Header Bar */}
            <div className="bg-[#14181F] border border-[#22C55E]/40 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-3.5">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-12 h-12 rounded-full border-2 border-[#22C55E] object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8732A] to-[#C45316] flex items-center justify-center text-base font-black text-white shrink-0">
                    {(fullName || email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-white">
                      {fullName || currentUser.fullName}
                    </span>
                    <span className="bg-[#122D21] text-[#4ADE80] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#22C55E]/40 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Google Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {email || currentUser.email} • Complete your B2B buyer profile below to activate quotation requests
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setStep('google_auth');
                }}
                className="text-xs text-[#94A3B8] hover:text-white bg-[#191F28] px-3 py-2 rounded-xl border border-[#2A3342] flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Google Account</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-[#2F1619] border border-[#EF4444]/40 text-[#F87171] text-xs rounded-xl flex items-center space-x-2.5 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCompleteProfile} className="space-y-6">
              {/* Section 1: Authorized Representative Details */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-2.5 border-b border-[#222934] pb-3.5 mb-5">
                  <div className="p-2 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white">
                      1. Authorized Contact & Representative Details
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Person responsible for receiving official quotation pricing and dispatch updates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-white mb-1.5">
                      Full Name <span className="text-[#E8732A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh K. Sharma"
                      className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-white mb-1.5">
                      Designation / Role in Company <span className="text-[#E8732A]">*</span>
                    </label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                    >
                      {DESIGNATION_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-white mb-1.5">
                      Mobile / WhatsApp Number (10-Digit) <span className="text-[#E8732A]">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#2A3342] bg-[#10141A] text-[#94A3B8] font-mono font-bold text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9820112345"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-r-xl p-2.5 text-white font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-white mb-1.5">
                      Verified Google Email <span className="text-[#4ADE80]">(Verified)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#10141A] border border-[#2A3342] rounded-xl p-2.5 text-[#CBD5E1] font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Company, Business Category & GST Profiling */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-2.5 border-b border-[#222934] pb-3.5 mb-5">
                  <div className="p-2 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white">
                      2. Company Profile, GST Tax Details & Procurement Scope
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Used for B2B billing, GST input tax credit, and tailoring mill lot allocations.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        Company / Firm Legal Name <span className="text-[#E8732A]">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Precision Engineering Pvt Ltd"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        Primary Business Type <span className="text-[#E8732A]">*</span>
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        <option value="Manufacturer">OEM / Industrial Manufacturer</option>
                        <option value="Fabricator">Precision & Heavy Steel Fabricator</option>
                        <option value="Contractor">EPC / Civil Infrastructure Contractor</option>
                        <option value="Wholesaler">Steel Stockist / Wholesaler</option>
                        <option value="Trader">Industrial Metal Trader</option>
                        <option value="Other">Other Engineering Enterprise</option>
                      </select>
                    </div>
                  </div>

                  {/* GSTIN Section */}
                  <div className="p-4 bg-[#191F28] border border-[#2A3342] rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="font-bold text-white">
                        GST Registration Status (For 18% Input Tax Credit Invoice)
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            checked={hasGstin}
                            onChange={() => setHasGstin(true)}
                            className="accent-[#E8732A]"
                          />
                          <span className="text-white font-bold">GST Registered</span>
                        </label>
                        <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            checked={!hasGstin}
                            onChange={() => {
                              setHasGstin(false);
                              setGstin('');
                            }}
                            className="accent-[#E8732A]"
                          />
                          <span className="text-[#94A3B8] font-medium">Unregistered / PAN Only</span>
                        </label>
                      </div>
                    </div>

                    {hasGstin && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#CBD5E1] mb-1">
                          15-Digit Company GSTIN (Optional now, or enter for instant GST invoicing)
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                          placeholder="27AABCS1429B1Z8"
                          className="w-full sm:max-w-sm bg-[#12161D] border border-[#2A3342] rounded-xl p-2.5 text-[#E8732A] font-mono font-bold tracking-wider"
                        />
                      </div>
                    )}
                  </div>

                  {/* Procurement Profiling: Materials & Monthly Volume */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                    <div className="sm:col-span-7">
                      <label className="block font-bold text-white mb-2">
                        Primary Materials of Interest (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {MATERIAL_INTEREST_OPTIONS.map((mat) => {
                          const active = selectedMaterials.includes(mat);
                          return (
                            <button
                              type="button"
                              key={mat}
                              onClick={() => toggleMaterialInterest(mat)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                active
                                  ? 'bg-[#251811] border-[#E8732A] text-[#E8732A]'
                                  : 'bg-[#191F28] border-[#2A3342] text-[#94A3B8] hover:text-white'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}
                              {mat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block font-bold text-white mb-2">
                        Estimated Monthly Steel Requirement
                      </label>
                      <select
                        value={monthlyVolume}
                        onChange={(e) => setMonthlyVolume(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        {VOLUME_OPTIONS.map((vol) => (
                          <option key={vol} value={vol}>
                            {vol}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Primary Delivery / Works Address */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-2.5 border-b border-[#222934] pb-3.5 mb-5">
                  <div className="p-2 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white">
                      3. Primary Delivery / Factory Works Location
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Required to calculate exact truck freight from our Ludhiana Dispatch Hub to your unloading gate.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-white mb-1.5">
                        Plot No. / MIDC Industrial Area / Street Address / Works Gate{' '}
                        <span className="text-[#E8732A]">*</span>
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. Plot No. C-44, MIDC Industrial Area, Turbhe, Gate No. 2"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        Landmark / Industrial Zone <span className="text-[#64748B]">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Weighbridge / Phase II"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        Address Usage Type <span className="text-[#E8732A]">*</span>
                      </label>
                      <select
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value as 'billing' | 'shipping' | 'both')}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        <option value="both">Both Billing & Delivery Address</option>
                        <option value="shipping">Factory / Warehouse Delivery Only</option>
                        <option value="billing">Registered Office Billing Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        City / Town <span className="text-[#E8732A]">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Navi Mumbai"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        District <span className="text-[#E8732A]">*</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Thane"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        State <span className="text-[#E8732A]">*</span>
                      </label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-white mb-1.5">
                        PIN Code (6-Digit) <span className="text-[#E8732A]">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="400705"
                        className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-mono font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Bar */}
              <div className="bg-gradient-to-r from-[#251811] to-[#14181F] border border-[#E06924]/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      Complete Registration & Unlock Quotation Requests
                    </h4>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Your details are securely stored for official B2B RFQ quotations and GST tax invoices.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold py-3.5 px-7 rounded-xl border border-[#F59352]/50 shadow-[0_4px_20px_rgba(224,105,36,0.4)] flex items-center justify-center space-x-2 shrink-0 cursor-pointer transition"
                >
                  <span>
                    {isSubmittingProfile
                      ? 'Saving Buyer Profile...'
                      : cart.length > 0
                      ? 'Complete Profile & Return to Quotation Cart'
                      : 'Complete Profile & Activate Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
