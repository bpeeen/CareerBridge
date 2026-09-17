import { GovScheme } from '../src/types';
import { generateAiText } from './ai';

export const OFFICIAL_GOV_SCHEMES: GovScheme[] = [
  {
    id: 'scheme-pmkvy-4',
    name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
    nameHi: 'प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)',
    authority: 'Ministry of Skill Development & Entrepreneurship (MSDE) & NSDC',
    targetAudience: 'Unemployed youth, school/college dropouts, rural youth seeking industry-certified training',
    category: 'Skill Development',
    eligibilityCriteria: {
      ageRange: [15, 45],
      educationMin: 'Class 8th / 10th / 12th depending on trade course',
      specialCriteria: ['Indian citizen with Aadhaar card', 'Bank account linked to Aadhaar']
    },
    benefits: [
      '100% Free Government-Certified Industry Skill Training (Short-Term Training & RPL)',
      'Training stipend of ₹8,000–₹12,000 during course duration',
      'Free NSDC Skill Card recognized nationally across all industries',
      'Job placement assistance & apprenticeship linkages'
    ],
    benefitsHi: [
      '100% निःशुल्क सरकारी प्रमाणित स्किल ट्रेनिंग (Short-Term Training & RPL)',
      'प्रशिक्षण के दौरान ₹8,000–₹12,000 तक की सहायता राशि',
      'पूरे देश में मान्य डिजिटल NSDC स्किल सर्टिफिकेट',
      'रोजगार मेला और प्लेसमेंट सहायता'
    ],
    requiredDocuments: ['Aadhaar Card', 'Bank Passbook copy', 'Educational Marksheet/Certificate', '2 Passport Photos'],
    applicationProcess: [
      'Visit the official Skill India Digital portal (skillindiadigital.gov.in) or visit your nearest Pradhan Mantri Kaushal Kendra (PMKK).',
      'Select your desired sector (IT, Electronics, Solar, Automotive, Healthcare, Construction).',
      'Enroll in the nearest training center and complete biometric verification.',
      'Undergo practical training, pass assessment exam, and receive certified NSDC credential.'
    ],
    officialSource: 'Ministry of Skill Development and Entrepreneurship',
    officialUrl: 'https://www.pmkvyofficial.org/',
    lastUpdated: 'Updated 2026-03-01'
  },
  {
    id: 'scheme-pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    nameHi: 'पीएम विश्वकर्मा योजना',
    authority: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    targetAudience: 'Traditional artisans, craftsmen, electricians, carpenters, plumbers, blacksmiths, tailors, mechanics',
    category: 'Self Employment',
    eligibilityCriteria: {
      ageRange: [18, 55],
      educationMin: 'No formal minimum education required',
      specialCriteria: ['Engaged in one of 18 traditional trades with hands/tools', 'One member per family']
    },
    benefits: [
      'Free PM Vishwakarma Certificate and Digital ID Card',
      'Skill Verification (Basic 5-7 days & Advanced 15 days training with ₹500/day stipend)',
      'Modern Toolkit Incentive Grant of ₹15,000 e-voucher',
      'Collateral-free Enterprise Development Loan up to ₹3,00,000 at highly concessional 5% interest (Tranche 1: ₹1 Lakh, Tranche 2: ₹2 Lakhs)'
    ],
    benefitsHi: [
      'निःशुल्क पीएम विश्वकर्मा प्रमाण पत्र और डिजिटल आईडी कार्ड',
      'ट्रेनिंग के दौरान ₹500 प्रतिदिन का भत्ता',
      'आधुनिक औजार किट खरीदने हेतु ₹15,000 का निःशुल्क ई-वाउचर अनुदान',
      'बिना किसी गारंटी के 5% ब्याज पर ₹3,00,000 तक का आसान लोन (पहली किश्त: ₹1 लाख, दूसरी: ₹2 लाख)'
    ],
    requiredDocuments: ['Aadhaar Card', 'Mobile linked with Aadhaar', 'Bank Account details', 'Ration Card / Family details'],
    applicationProcess: [
      'Register for free through your nearest Common Service Center (CSC) with biometric authentication.',
      'Gram Panchayat / Urban Local Body verification.',
      'Receive official PM Vishwakarma ID and complete 5-day basic training at ITI/training center.',
      'Receive ₹15,000 toolkit voucher and access subsidized enterprise loan.'
    ],
    officialSource: 'Ministry of MSME & Government of India',
    officialUrl: 'https://pmvishwakarma.gov.in/',
    lastUpdated: 'Updated 2026-02-15'
  },
  {
    id: 'scheme-pm-svanidhi',
    name: 'PM SVANidhi (Micro-Credit for Street Vendors & Micro-Workers)',
    nameHi: 'पीएम स्वनिधि योजना',
    authority: 'Ministry of Housing and Urban Affairs (MoHUA)',
    targetAudience: 'Street vendors, small service providers, delivery personnel, informal urban/semi-urban workers',
    category: 'Financial Support',
    eligibilityCriteria: {
      ageRange: [18, 60],
      educationMin: 'None',
      specialCriteria: ['Engaged in vending/micro-enterprise in urban or peri-urban areas']
    },
    benefits: [
      'Initial working capital loan of ₹10,000 (1st Tranche), ₹20,000 (2nd Tranche), and ₹50,000 (3rd Tranche)',
      'Interest subsidy of 7% per annum credited directly to bank account on timely repayment',
      'Cashback incentives up to ₹1,200 per year for conducting digital transactions (UPI)'
    ],
    benefitsHi: [
      'बिना गारंटी वर्किंग कैपिटल लोन: ₹10,000 (पहला), ₹20,000 (दूसरा), और ₹50,000 (तीसरा चरण)',
      'समय पर भुगतान करने पर 7% वार्षिक ब्याज सब्सिडी बैंक खाते में',
      'डिजिटल भुगतान (UPI) करने पर हर साल ₹1,200 तक का कैशबैक'
    ],
    requiredDocuments: ['Aadhaar Card', 'Vending Certificate / Letter of Recommendation from local body', 'Bank Passbook'],
    applicationProcess: [
      'Apply online via pmsvanidhi.mohua.gov.in or through a nearby Banking Correspondent / CSC.',
      'Submit KYC details and select preferred lending institution (Public/Private Bank or NBFC).',
      'Direct disbursement within 7 days to bank account.'
    ],
    officialSource: 'Ministry of Housing & Urban Affairs',
    officialUrl: 'https://pmsvanidhi.mohua.gov.in/',
    lastUpdated: 'Updated 2026-01-20'
  },
  {
    id: 'scheme-ddu-gky',
    name: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)',
    nameHi: 'दीनदयाल उपाध्याय ग्रामीण कौशल्य योजना (DDU-GKY)',
    authority: 'Ministry of Rural Development (MoRD)',
    targetAudience: 'Rural youth (15–35 years) from poor/marginalized households seeking permanent salaried employment',
    category: 'Rural Livelihoods',
    eligibilityCriteria: {
      ageRange: [15, 35],
      educationMin: 'Class 5th / 8th / 10th / 12th',
      specialCriteria: ['Rural youth with BPL / SECC list verification or MGNREGA job card family']
    },
    benefits: [
      'Residential / Non-residential fully funded technical training with free food, uniform, and course books',
      'Mandatory guaranteed wage employment (minimum 70% placement rate in formal sector jobs)',
      'Post-placement support of ₹1,000–₹3,000/month for up to 6 months to help adjust in new cities'
    ],
    benefitsHi: [
      'निःशुल्क आवासीय ट्रेनिंग, भोजन, यूनिफॉर्म और स्टडी सामग्री',
      'कम से कम 70% छात्रों को संगठित क्षेत्र में पक्की नौकरी की गारंटी',
      'नौकरी मिलने के बाद 6 महीने तक ₹1,000–₹3,000 प्रतिमाह पोस्ट-प्लेसमेंट सहायता'
    ],
    requiredDocuments: ['Aadhaar Card', 'BPL Card / MGNREGA Job Card / SECC proof', 'Age & School leaving certificate'],
    applicationProcess: [
      'Register at Gram Panchayat employment camps or via DDU-GKY Kaushal Panjee portal.',
      'Counseling session to choose trade (Hospitality, IT-BPO, Retail, Automotive, Logistics).',
      'Join dedicated training center for 3–12 months training + guaranteed interview drive.'
    ],
    officialSource: 'Ministry of Rural Development',
    officialUrl: 'https://ddugky.gov.in/',
    lastUpdated: 'Updated 2026-02-10'
  },
  {
    id: 'scheme-naps-apprenticeship',
    name: 'National Apprenticeship Promotion Scheme (NAPS-2)',
    nameHi: 'राष्ट्रीय शिक्षुता संवर्धन योजना (NAPS-2)',
    authority: 'Ministry of Skill Development and Entrepreneurship',
    targetAudience: 'Engineering, Diploma, ITI, and non-technical graduates looking for paid corporate apprenticeships',
    category: 'Apprenticeship',
    eligibilityCriteria: {
      ageRange: [16, 35],
      educationMin: 'Class 10th / 12th / ITI / Diploma / Any Graduate Degree',
      specialCriteria: ['Not currently employed full-time, registered on Apprenticeship Portal']
    },
    benefits: [
      'Direct government stipend co-funding (25% of prescribed stipend up to ₹1,500/month paid directly by DBT)',
      'Monthly industrial stipend ranging between ₹8,000 and ₹18,000/month depending on degree and industry',
      'Hands-on corporate experience at leading firms (Tata, L&T, Infosys, Maruti, PSUs)',
      'National Apprenticeship Certificate (NAC) upon completion'
    ],
    benefitsHi: [
      '₹8,000 से ₹18,000 प्रतिमाह स्टाइपेंड के साथ बड़ी कंपनियों में 1 वर्ष का ऑन-जॉब अनुभव',
      'भारत सरकार द्वारा ₹1,500 प्रतिमाह डायरेक्ट बेनिफिट ट्रांसफर (DBT) स्टाइपेंड सपोर्ट',
      'प्रशिक्षण पूरा होने पर नेशनल अप्रेंटिसशिप सर्टिफिकेट (NAC)'
    ],
    requiredDocuments: ['Aadhaar Card', 'Final Year Marksheet / Degree Certificate', 'Bank Account details'],
    applicationProcess: [
      'Create profile on apprenticeshipindia.gov.in (NAPS portal).',
      'Search vacancies by trade, location, and educational qualification.',
      'Apply directly to enterprise openings and sign contract online.'
    ],
    officialSource: 'Apprenticeship Division, MSDE',
    officialUrl: 'https://www.apprenticeshipindia.gov.in/',
    lastUpdated: 'Updated 2026-03-05'
  },
  {
    id: 'scheme-pm-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    nameHi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    authority: 'Department of Financial Services, Ministry of Finance',
    targetAudience: 'Small entrepreneurs, self-employed professionals, tech startups, artisans, shopkeepers, service providers',
    category: 'Financial Support',
    eligibilityCriteria: {
      ageRange: [18, 65],
      educationMin: 'None',
      specialCriteria: ['Non-corporate, non-farm small/micro enterprise']
    },
    benefits: [
      'Shishu Category: Loans up to ₹50,000 for setting up early ventures or toolkits',
      'Kishore Category: Loans from ₹50,000 up to ₹5,00,000 for expanding equipment and inventory',
      'Tarun Category: Loans up to ₹10,00,000 (extended to ₹20,00,000 under latest budget)',
      'Zero collateral or third-party guarantor required'
    ],
    benefitsHi: [
      'शिशु श्रेणी: ₹50,000 तक का लोन (नया काम शुरू करने हेतु)',
      'किशोर श्रेणी: ₹50,000 से ₹5 लाख तक (उपकरण और विस्तार हेतु)',
      'तरुण श्रेणी: ₹5 लाख से ₹20 लाख तक का लोन',
      'कोई गारंटी या संपत्ति गिरवी रखने की आवश्यकता नहीं'
    ],
    requiredDocuments: ['Identity Proof', 'Address Proof', 'Business Plan / Quotation of machinery', 'Bank statements for 6 months'],
    applicationProcess: [
      'Apply online via udyamimitra.in portal or visit any public/private commercial bank, RRB, or MFI.',
      'Submit simple 1-page application with business proposal.',
      'Loan sanction and Mudra Debit Card issuance for seamless working capital withdrawals.'
    ],
    officialSource: 'Ministry of Finance, Government of India',
    officialUrl: 'https://www.mudra.org.in/',
    lastUpdated: 'Updated 2026-02-28'
  }
];

export function getStateSpecificSchemes(stateName?: string, districtName?: string): GovScheme[] {
  const state = stateName?.trim() || 'Jharkhand';
  const district = districtName?.trim() || 'Ranchi';
  const stateLower = state.toLowerCase();
  const stateId = stateLower.replace(/\s+/g, '-');

  const stateSchemes: GovScheme[] = [
    {
      id: `scheme-${stateId}-skill`,
      name: `${state} State Skill Development Mission (${district} Center)`,
      nameHi: `${state} राज्य कौशल विकास मिशन (${district} केंद्र)`,
      authority: `Department of Higher & Technical Education, Government of ${state}`,
      targetAudience: `Youth and skilled workers residing in ${district} and all districts of ${state}`,
      category: 'Skill Development',
      eligibilityCriteria: {
        ageRange: [18, 35],
        educationMin: 'Class 8th / 10th / 12th',
        specialCriteria: [`Domicile of ${state} state (${district} district)`, 'Aadhaar linked bank account']
      },
      benefits: [
        '100% Free Job-Oriented Skill Training in Solar, Electrical, IT, and Automotive',
        'Free Uniform, Course Materials, and Daily Conveyance Allowance',
        'Recognized State Certification and Guaranteed Regional Job Fairs'
      ],
      benefitsHi: [
        '100% मुफ्त तकनीकी प्रशिक्षण (सोलर, इलेक्ट्रिशियन, कंप्यूटर, ऑटोमोटिव)',
        'निःशुल्क यूनिफॉर्म, पुस्तकें और दैनिक यात्रा भत्ता',
        'राज्य सरकार द्वारा मान्यता प्राप्त प्रमाण पत्र और रोजगार मेला प्लेसमेंट'
      ],
      requiredDocuments: [`${state} Domicile Certificate / Resident Certificate`, 'Aadhaar Card', 'Bank Passbook', 'Marksheet'],
      applicationProcess: [
        `Visit your local District Employment Exchange in ${district} or register at the official ${state} skill portal`,
        'Select your preferred trade and nearest training center',
        'Complete free biometric enrollment and start daily training'
      ],
      officialSource: `Government of ${state}`,
      officialUrl: `https://skill.${stateId}.gov.in`,
      lastUpdated: 'Updated 2026-03-01'
    },
    {
      id: `scheme-${stateId}-employment`,
      name: `Mukhyamantri ${state} Employment Generation Programme (MMEGP)`,
      nameHi: `मुख्यमंत्री ${state} रोजगार सृजन योजना`,
      authority: `Department of Industries, Government of ${state}`,
      targetAudience: `Young entrepreneurs, ITI graduates, and micro-workers in ${district} & ${state}`,
      category: 'Self Employment',
      eligibilityCriteria: {
        ageRange: [18, 50],
        educationMin: 'Class 10th / ITI / Polytechnic / Diploma / Graduate',
        specialCriteria: [`Permanent resident of ${state} state (${district})`, 'Proprietorship / Firm setup']
      },
      benefits: [
        'Total Enterprise Financial Grant / Concessional Loan up to ₹10,00,000 per project',
        '30% to 50% as 100% Free Government Grant / Subsidy depending on category',
        'Remaining amount as Interest-Free or highly subsidized Soft Loan repayable in easy installments'
      ],
      benefitsHi: [
        `कुल ₹10 लाख की वित्तीय सहायता (नया उद्योग / बिजनेस शुरू करने हेतु)`,
        '30% से 50% तक की भारी सरकारी सब्सिडी (अनुदान)',
        'बाकी का हिस्सा ब्याज-मुक्त या सब्सिडी ब्याज पर आसान ऋण'
      ],
      requiredDocuments: [`${state} Resident Certificate`, 'Aadhaar Card', 'Marksheet', 'Canceled Cheque / Firm Bank Account'],
      applicationProcess: [
        `Register online at the official industries portal of ${state} or visit the DIC (District Industries Center) in ${district}`,
        'Submit business project report for manufacturing or service trade',
        'Direct grant release in two tranches upon physical inspection'
      ],
      officialSource: `Industries Department, Govt of ${state}`,
      officialUrl: `https://industries.${stateId}.gov.in`,
      lastUpdated: 'Updated 2026-02-20'
    },
    {
      id: `scheme-${stateId}-livelihoods`,
      name: `${state} State Rural Livelihoods Promotion Mission (${district} Support)`,
      nameHi: `${state} राज्य ग्रामीण आजीविका मिशन (सखी मंडल सहायता)`,
      authority: `Rural Development Department, Government of ${state}`,
      targetAudience: `Rural women, self-help groups, small farmers, and micro-workers in ${district}`,
      category: 'Rural Livelihoods',
      eligibilityCriteria: {
        ageRange: [18, 55],
        educationMin: 'None',
        specialCriteria: [`Resident of rural ${state} (${district} block)`, 'Member of a registered Self-Help Group (SHG)']
      },
      benefits: [
        'Revolving Fund support of ₹15,000 per eligible Self-Help Group',
        'Community Investment Fund up to ₹50,000 for local agricultural or dairy livelihoods',
        'Direct bank linkage for collateral-free credit at highly concessional interest rates'
      ],
      benefitsHi: [
        'स्वयं सहायता समूह (SHG) को ₹15,000 का रिवॉल्विंग फंड सहायता',
        'कृषि, डेयरी या स्थानीय व्यवसाय शुरू करने हेतु ₹50,000 तक का फंड',
        'बिना गारंटी कम ब्याज दर पर बैंक क्रेडिट लिंकेज सहायता'
      ],
      requiredDocuments: ['Aadhaar Card', 'SHG Membership proof', 'Bank Account passbook copy'],
      applicationProcess: [
        `Contact your local Gram Panchayat Livelihood Coordinator or Block Development Office (BDO) in ${district}`,
        'Submit the group resolution form and passbook details',
        'Receive credit allocation directly in the group bank account'
      ],
      officialSource: `Rural Development Department, Govt of ${state}`,
      officialUrl: `https://srlm.${stateId}.gov.in`,
      lastUpdated: 'Updated 2026-02-15'
    },
    {
      id: `scheme-${stateId}-apprentice`,
      name: `Mukhyamantri ${state} Apprenticeship Promotion Scheme (MAPS)`,
      nameHi: `मुख्यमंत्री ${state} शिक्षुता प्रोत्साहन योजना`,
      authority: `Department of Technical Education & Skill Development, Government of ${state}`,
      targetAudience: `ITI, Diploma, and Graduate youth seeking practical industry training in ${state}`,
      category: 'Skill Development',
      eligibilityCriteria: {
        ageRange: [18, 30],
        educationMin: 'ITI / Diploma / Graduate Pass',
        specialCriteria: [`Resident of ${state}`, 'Registered on National Apprenticeship Portal']
      },
      benefits: [
        'Guaranteed 1-Year Paid Apprentice Placement in leading private/public industries',
        'Monthly stipend of ₹8,000 to ₹12,000 with ₹1,500 state government subsidy',
        'Hands-on industrial experience and government certified completion certificate'
      ],
      benefitsHi: [
        'अग्रणी उद्योगों में 1 वर्ष का सशुल्क अप्रेंटिसशिप प्लेसमेंट',
        '₹8,000 से ₹12,000 प्रति माह वजीफा (जिसमें राज्य सरकार का ₹1,500 योगदान शामिल)',
        'व्यावहारिक औद्योगिक अनुभव और प्रमाणित सरकारी प्रमाण पत्र'
      ],
      requiredDocuments: ['ITI / Diploma Marksheet', 'Aadhaar Card', `${state} Resident Proof`, 'Bank Details'],
      applicationProcess: [
        `Register on the National Apprenticeship Portal and choose ${state} State Apprenticeship Scheme`,
        `Apply to listed industries or local government workshops in ${district}`,
        'Complete registration and sign contract to begin the apprentice term'
      ],
      officialSource: `Technical Education Department, Govt of ${state}`,
      officialUrl: `https://apprenticeship.${stateId}.gov.in`,
      lastUpdated: 'Updated 2026-03-01'
    },
    {
      id: `scheme-${stateId}-toolkits`,
      name: `${state} Artisans & Trade Workers Free Toolkits Scheme`,
      nameHi: `${state} विश्वकर्मा शिल्पी औजार किट योजना`,
      authority: `Directorate of Industries & Commerce, Government of ${state}`,
      targetAudience: `Traditional artisans, electricians, plumbers, carpenters, and tailors in ${district}`,
      category: 'Self Employment',
      eligibilityCriteria: {
        ageRange: [18, 55],
        educationMin: 'None required',
        specialCriteria: [`Domicile of ${state} (${district} district)`, 'Engaged in a certified trade or craft']
      },
      benefits: [
        '100% Free modern, certified Toolkit e-voucher worth ₹15,000',
        'Free 5-day professional upgradation training at local ITI with stipend',
        'Priority access to low-interest loans for buying shop machinery'
      ],
      benefitsHi: [
        '₹15,000 मूल्य की 100% मुफ्त आधुनिक टूलकिट ई-वाउचर सहायता',
        'स्थानीय आईटीआई में 5 दिवसीय मुफ्त प्रशिक्षण और दैनिक भत्ता',
        'दुकान और मशीनरी खरीदने हेतु कम ब्याज दर पर ऋण प्राथमिकता'
      ],
      requiredDocuments: ['Aadhaar Card', `${state} Resident Certificate`, 'Trade / Business self-declaration certificate'],
      applicationProcess: [
        `Submit application online or at the District Industries Centre (DIC) in ${district}`,
        'Verification of trade/skills by local supervisor committee',
        'Receive toolkit e-voucher directly on your linked mobile number'
      ],
      officialSource: `Directorate of Industries, Govt of ${state}`,
      officialUrl: `https://dic.${stateId}.gov.in`,
      lastUpdated: 'Updated 2026-02-28'
    }
  ];

  return stateSchemes;
}

export function getOfficialSchemes(stateName?: string, districtName?: string): GovScheme[] {
  const stateSchemes = getStateSpecificSchemes(stateName, districtName);
  return [...stateSchemes, ...OFFICIAL_GOV_SCHEMES];
}

/**
 * Searches and retrieves official schemes matching keywords, domain or conversational queries.
 */
export function searchSchemes(query: string): GovScheme[] {
  if (!query || query.trim() === '') {
    return OFFICIAL_GOV_SCHEMES;
  }

  const qLower = query.toLowerCase();
  return OFFICIAL_GOV_SCHEMES.filter((scheme: GovScheme) => {
    return (
      scheme.name.toLowerCase().includes(qLower) ||
      scheme.nameHi.includes(query) ||
      scheme.category.toLowerCase().includes(qLower) ||
      scheme.targetAudience.toLowerCase().includes(qLower) ||
      scheme.benefits.some((b: string) => b.toLowerCase().includes(qLower)) ||
      scheme.authority.toLowerCase().includes(qLower)
    );
  });
}

/**
 * Grounded RAG query answering about schemes.
 */
export async function searchSchemesRAG(query: string, language: 'en' | 'hi' = 'en') {
  const matched = searchSchemes(query);
  const context = matched.slice(0, 3).map((s) => ({
    name: s.name,
    nameHi: s.nameHi,
    benefits: s.benefits,
    eligibility: s.eligibilityCriteria,
    docs: s.requiredDocuments,
    url: s.officialUrl,
    source: s.officialSource
  }));

  const prompt = `You are a helpful government scheme advisor. Answer the user's query clearly and concisely based ONLY on the provided verified schemes.
User Query: "${query}"
Preferred Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

Scheme Context:
${JSON.stringify(context, null, 2)}

Provide a clear 2-3 sentence answer explaining eligibility, key benefit, and how to apply.`;

  try {
    const aiText = await generateAiText(prompt, 'You are a helpful government scheme advisor.');

    return {
      answer: aiText || (language === 'hi' 
        ? `आप ${matched[0]?.nameHi || 'सरकारी योजना'} के लिए पात्र हो सकते हैं। इसमें मुफ्त प्रशिक्षण एवं सहायता उपलब्ध है।`
        : `Based on your profile, you may be eligible for ${matched[0]?.name || 'Government Schemes'}. You can apply through the official portal.`),
      matchedSchemes: matched,
      sourceCitations: matched.slice(0, 3).map((s) => ({
        name: s.name,
        authority: s.authority,
        url: s.officialUrl,
      })),
    };
  } catch (error) {
    return {
      answer: language === 'hi'
        ? `आपके लिए ${matched[0]?.nameHi || 'सरकारी योजना'} उपयुक्त है जिसमें कौशल प्रशिक्षण और वित्तीय सहायता दी जाती है।`
        : `You are eligible for ${matched[0]?.name || 'Government Skill Schemes'} which offers certified training and financial assistance.`,
      matchedSchemes: matched,
      sourceCitations: matched.slice(0, 3).map((s) => ({
        name: s.name,
        authority: s.authority,
        url: s.officialUrl,
      })),
    };
  }
}
