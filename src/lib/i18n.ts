import type { Language } from '../types/truthlens';

export const copy = {
  en: {
    tagline: 'Break the Deepfake Loop.',
    subtitle:
      'Systems Thinking + Gemini AI to stop virality, protect mental health, and restore trust.',
    badge: 'BUILDATHON 2026 • INDIA • HYPOTHETICA',
    nav: {
      overview: 'Systems Map',
      detect: 'Edge Forensics',
      vault: 'Origin Vault',
      dampen: 'Virality & Wellbeing',
      heal: 'Heal & Legal',
      solutions: '6 Industry Verticals',
      system: 'API & Gateway',
    },
    navSub: {
      overview: 'Causal Loops & Architecture',
      detect: 'L0 • ELA, SynthID, Audio FFT',
      vault: 'L1 • Qdrant Perceptual Hash',
      dampen: 'L2 • Cooling, Outrage & Bots',
      heal: 'L3 • Crisis Coach, Debunk, BSA 63',
      solutions: 'KYC, BEC 2.0, UGC, Claims, Legal',
      system: 'v2.2.0 • 16 Live Endpoints',
    },
    liveMode: 'Live Server',
    edgeDemoMode: 'Edge Demo Mode',
    serverUrl: 'Backend Base URL',
    pingHealth: 'Ping /health',
    downloadApk: 'Android APK',
    quickActions: {
      scanNow: 'Run Edge Forensics',
      registerOriginal: 'Protect in Vault (L1)',
      simulateSpread: 'Simulate 24h Virality (L2)',
      openHeal: 'Victim Crisis & Legal (L3)',
    },
    crisisWelcome:
      "Take a slow breath. You are safe right now, and you do not have to face this alone. Let's pause for 10 seconds, then secure cryptographic proof and trigger a 24-hour legal takedown together.",
    crisisPrompts: [
      'Someone morphed my photo on WhatsApp',
      'I am panicking, it is spreading in college groups',
      'How do I file a Cyber Cell complaint fast?',
      'Help me calm down first',
    ],
  },
  hi: {
    tagline: 'डीपफेक लूप को तोड़ें।',
    subtitle:
      'सिस्टम्स थिंकिंग + Gemini AI: वायरलिटी रोकें, मानसिक स्वास्थ्य बचाएं और भरोसा बहाल करें।',
    badge: 'बिल्डैथॉन 2026 • भारत • हाइपोथेटिका',
    nav: {
      overview: 'सिस्टम्स मैप',
      detect: 'एज फ़ॉरेंसिक्स',
      vault: 'ओरिजिन वॉल्ट',
      dampen: 'वायरलिटी व वेलबीइंग',
      heal: 'हील और क़ानूनी मदद',
      solutions: '6 इंडस्ट्री वर्टिकल्स',
      system: 'API और गेटवे',
    },
    navSub: {
      overview: 'कॉज़ल लूप्स व आर्किटेक्चर',
      detect: 'L0 • ELA, SynthID, ऑडियो FFT',
      vault: 'L1 • Qdrant परसेप्चुअल हैश',
      dampen: 'L2 • कूलिंग, आउटरेज व बॉट्स',
      heal: 'L3 • क्राइसिस कोच, डीबंक, BSA 63',
      solutions: 'KYC, BEC 2.0, UGC, क्लेम्स, लीगल',
      system: 'v2.2.0 • 16 लाइव एंडपॉइंट्स',
    },
    liveMode: 'लाइव सर्वर',
    edgeDemoMode: 'एज डेमो मोड',
    serverUrl: 'बैकएंड बेस URL',
    pingHealth: '/health जांचें',
    downloadApk: 'एंड्रॉइड APK',
    quickActions: {
      scanNow: 'एज फ़ॉरेंसिक्स चलाएं',
      registerOriginal: 'वॉल्ट में सुरक्षित करें (L1)',
      simulateSpread: '24 घंटे की वायरलिटी देखें (L2)',
      openHeal: 'पीड़ित सहायता व क़ानूनी नोटिस (L3)',
    },
    crisisWelcome:
      'धीरे-धीरे लंबी सांस लें। आप इस समय सुरक्षित हैं और आपको इसका अकेले सामना नहीं करना है। पहले 10 सेकंड शांत हों, फिर हम साथ मिलकर क्रिप्टोग्राफ़िक सबूत तैयार करेंगे और 24 घंटे का क़ानूनी टेकडाउन नोटिस भेजेंगे।',
    crisisPrompts: [
      'किसी ने WhatsApp पर मेरी फ़ोटो मॉर्फ़ कर दी है',
      'मुझे घबराहट हो रही है, यह ग्रुप में फैल रहा है',
      'साइबर सेल में तुरंत शिकायत कैसे दर्ज करें?',
      'पहले मुझे शांत होने में मदद करें',
    ],
  },
} as const;

export function t(lang: Language) {
  return copy[lang];
}
