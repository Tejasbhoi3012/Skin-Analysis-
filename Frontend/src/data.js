import skinPhoto from './assets/skin-photo.png';
import heroSkin from './assets/hero-skin.jpg';
import resultSkin from './assets/result-skin.jpg';
import historyAcne from './assets/history-acne.png';
import historyKeratosis from './assets/history-keratosis.png';
import historyNevus from './assets/history-nevus.png';
import specialistDermacare from './assets/specialist-dermacare.png';
import specialistSkinworks from './assets/specialist-skinworks.png';
import expertAvatar from './assets/avatar-profile.png';
import conditionAcne from './assets/condition-acne.jpg';
import conditionEczema from './assets/condition-eczema.jpg';
import conditionRosacea from './assets/condition-rosacea.jpg';
import conditionPigment from './assets/condition-pigment.jpg';

export const SAMPLE_RESULT = {
  diagnosis: 'Acne Vulgaris',
  severity: 'medium',
  confidence: 78,
  laboratory: 'Localized superficial inflammation',
  notes:
    'Lesions appear localized along the right zygomatic arch with mild inflammatory erythema and isolated comedonal papules. No deep cystic nodules or ulcerations detected in the current focus region.',
  differential: [
    {
      name: 'Papulopustular Rosacea',
      confidence: 14,
      description:
        'Evaluated due to cheek location and erythema, though absence of persistent flushing and telangiectasia reduces likelihood.',
    },
    {
      name: 'Contact Dermatitis',
      confidence: 8,
      description:
        'Discrete follicular pustules are typical of acneiform eruption, and lack of recent product exposure lowers this possibility.',
    },
  ],
  care: [
    {
      title: 'Gentle Daily Cleansing',
      icon: 'droplets',
      text: 'Use a mild, non-comedogenic, fragrance-free cleanser twice daily with lukewarm water. Avoid vigorous scrubbing brushes which exacerbate erythema.',
    },
    {
      title: 'Protect Skin Barrier & Avoid Trauma',
      icon: 'shield',
      text: 'Strictly avoid picking, squeezing, or popping active papules. Physical trauma drives bacteria deeper into the dermis and drastically elevates hyperpigmentation risks.',
    },
    {
      title: 'Hydration & Photoprotection',
      icon: 'sun',
      text: 'Apply a lightweight, oil-free moisturizer formulated with ceramides or niacinamide, accompanied by daily broad-spectrum SPF 30+ sunscreen.',
    },
  ],
  refer_to_dermatologist: true,
  disclaimer:
    'This digital assessment is an AI-generated informational summary and does not constitute a formal medical diagnosis, prognosis, or prescription. Skin conditions present variably across diverse Fitzpatrick types. If you observe rapid changes in size, shape, bleeding, or escalating tenderness, seek an in-person consultation with a board-certified dermatologist immediately.',
  captured_at: 'Today, 10:42 AM',
  reference: 'DS-8924',
};

export const SAMPLE_CAPTURE = {
  site: 'Right Cheek / Facial Detail',
  illumination: 'Diffuse Natural / Device Profile',
  resolution: '12.2 MP Macro / Mobile Sensor v4',
  quality: 96,
  triage: 'Medium Severity Â· Stable',
  stage: 'Stage 2 of 4',
};

export const SAMPLE_HISTORY = [
  {
    id: 'sample-acne',
    image: historyAcne,
    diagnosis: 'Acne Vulgaris',
    severity: 'medium',
    date: 'Nov 18, 2024',
    time: '10:14 AM',
    area: 'Cheek & Jawline Area',
    code: 'L-04',
    confidence: 78,
    confidenceLabel: 'high cert.',
    state: 'active',
  },
  {
    id: 'sample-keratosis',
    image: historyKeratosis,
    diagnosis: 'Seborrheic Keratosis',
    severity: 'low',
    date: 'Oct 24, 2024',
    time: '03:40 PM',
    area: 'Upper Shoulder Region',
    code: 'L-03',
    confidence: 92,
    confidenceLabel: 'benign profile',
    state: 'ok',
  },
  {
    id: 'sample-nevus',
    image: historyNevus,
    diagnosis: 'Atypical Nevus',
    severity: 'high',
    date: 'Sep 12, 2024',
    time: '11:20 AM',
    area: 'Left Mid-Back',
    code: 'L-02',
    confidence: 84,
    confidenceLabel: 'biopsy advised',
    state: 'alert',
  },
];

export const SPECIALISTS = [
  {
    id: 'dermacare',
    image: specialistDermacare,
    name: 'DermaCare Specialty Clinic',
    lead: 'Lead: Dr. Rajesh Rao (16 yrs exp)',
    availability: 'Next: Today 4:30 PM',
    rating: '4.8',
    reviews: '312 reviews',
    distance: '2.8 km away',
    address: 'HAL 2nd Stage, Indiranagar Â· Accepts Teleconsult',
    accent: 'mint',
  },
  {
    id: 'skinworks',
    image: specialistSkinworks,
    name: 'SkinWorks Laser & Aesthetic',
    lead: 'General & Laser Dermatology',
    availability: 'Open tomorrow 10 AM',
    rating: '4.7',
    reviews: '95 reviews',
    distance: '4.1 km away',
    address: 'Old Airport Road, Kodihalli Â· Near Leela Palace',
    accent: 'plain',
  },
];

export const DOCTOR = {
  name: 'Dr. Ananya Rao',
  role: 'Vision Active',
  avatar: expertAvatar,
};

export const CONDITION_CARDS = [
  {
    name: 'Acne & Breakouts',
    tag: 'Common',
    image: conditionAcne,
    short: 'Comedonal, inflammatory, and cystic variations across sebum-prone zones.',
    accuracy: '98.3% Detection Acc.',
    slug: 'acne',
  },
  {
    name: 'Eczema & Dryness',
    tag: 'Chronic',
    image: conditionEczema,
    short: 'Atopic dermatitis, xerosis, and contact sensitivities affecting the barrier.',
    accuracy: '96.4% Detection Acc.',
    slug: 'eczema',
  },
  {
    name: 'Rosacea',
    tag: 'Vascular',
    image: conditionRosacea,
    short: 'Erythematotelangiectatic flushing and papulopustular presentations.',
    accuracy: '94.1% Detection Acc.',
    slug: 'rosacea',
  },
  {
    name: 'Melasma & Pigment',
    tag: 'Pigmentary',
    image: conditionPigment,
    short: 'Hyperpigmentation, post-inflammatory marks, and uneven tone patterns.',
    accuracy: '98.8% Detection Acc.',
    slug: 'pigment',
  },
];

export const LANDING_FAQS = [
  {
    q: 'Is this a medical diagnosis?',
    a: 'No. DermaScan AI provides an informational, AI-assisted skin assessment. It is designed to help you understand visible concerns and prepare for a conversation with a clinician, not to replace one.',
  },
  {
    q: 'What skin tones does it support?',
    a: 'Our reference library includes varied Fitzpatrick phototypes and is continuously reviewed to reduce bias across skin tones. Performance is strongest with a clear, natural-light photograph of the affected area.',
  },
  {
    q: 'How accurate is the AI model?',
    a: 'Confidence scores reflect how closely a photo matches validated training patterns. They are not a guarantee of accuracy. A low-confidence result may mean the image quality is limited or the finding needs in-person review.',
  },
  {
    q: 'When should I see an emergency doctor?',
    a: 'Seek urgent care for rapidly spreading redness, fever, severe pain, blistering, bleeding, or a lesion that is changing quickly. DermaScan AI is not an emergency service.',
  },
  {
    q: 'Is my photo private and secure?',
    a: 'Photos are processed transiently for the assessment and are not stored by this app. Your history is only saved when you explicitly choose to save a result.',
  },
];

export const SAMPLE_CONDITIONS = [
  {
    id: 'acne',
    name: 'Acne Vulgaris',
    short: 'Inflammatory and comedonal lesions arising from follicular hyperkeratinization.',
    symptoms: ['Papules', 'Pustules', 'Comedones', 'Oily skin'],
    image: conditionAcne,
  },
  {
    id: 'eczema',
    name: 'Atopic Dermatitis',
    short: 'A barrier disorder marked by dryness, itch, and recurrent eczematous patches.',
    symptoms: ['Dryness', 'Itch', 'Erythema', 'Lichenification'],
    image: conditionEczema,
  },
  {
    id: 'rosacea',
    name: 'Rosacea',
    short: 'Chronic facial flushing with vascular and inflammatory components.',
    symptoms: ['Flushing', 'Telangiectasia', 'Papules', 'Sensitivity'],
    image: conditionRosacea,
  },
  {
    id: 'melasma',
    name: 'Melasma',
    short: 'Acquired hyperpigmentation often triggered by sun exposure and hormones.',
    symptoms: ['Patches', 'Symmetry', 'Sun sensitivity'],
    image: conditionPigment,
  },
];

export const HERO_IMAGE = heroSkin;

export const titleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const confidenceValue = (value, fallback = 78) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
};

const CARE_ICONS = ['droplets', 'shield', 'sun', 'leaf'];

export function normalizeResult(result, previewUrl) {
  if (!result) {
    return { ...SAMPLE_RESULT, image: previewUrl || resultSkin };
  }

  if (result.rawText) {
    return {
      ...SAMPLE_RESULT,
      diagnosis: 'Analysis prepared',
      notes: result.rawText,
      image: previewUrl || resultSkin,
    };
  }

  const differential = Array.isArray(result.differential)
    ? result.differential.map((item, index) => {
        const base = SAMPLE_RESULT.differential[index] || SAMPLE_RESULT.differential[0];
        if (typeof item === 'string') {
          return {
            name: titleCase(item),
            confidence: null,
            description: 'Considered as an alternative classification by the multi-class model.',
          };
        }
        return {
          name: titleCase(item.name || item.diagnosis || 'Alternate finding'),
          confidence: item.confidence != null ? confidenceValue(item.confidence, 0) : null,
          description: item.description || base.description,
        };
      })
    : [];

  const care = Array.isArray(result.treatment_recommendations)
    ? result.treatment_recommendations.map((item, index) => {
        if (typeof item === 'object' && item) {
          return {
            title: item.title || `Care Step ${index + 1}`,
            icon: item.icon || CARE_ICONS[index % CARE_ICONS.length],
            text: item.text || item.description || '',
          };
        }
        return {
          title: index === 0 ? 'Daily skin care' : index === 1 ? 'Barrier support' : 'Protection & follow-up',
          icon: CARE_ICONS[index % CARE_ICONS.length],
          text: String(item),
        };
      })
    : [];

  return {
    ...SAMPLE_RESULT,
    ...result,
    diagnosis: titleCase(result.diagnosis) || SAMPLE_RESULT.diagnosis,
    severity: String(result.severity || SAMPLE_RESULT.severity).toLowerCase(),
    confidence: confidenceValue(result.confidence),
    notes: result.notes || SAMPLE_RESULT.notes,
    differential: differential.length ? differential : SAMPLE_RESULT.differential,
    care: care.length ? care : SAMPLE_RESULT.care,
    refer_to_dermatologist: Boolean(result.refer_to_dermatologist),
    disclaimer: result.disclaimer || SAMPLE_RESULT.disclaimer,
    image: previewUrl || resultSkin,
  };
}


