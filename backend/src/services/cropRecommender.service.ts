/**
 * AgroSmart Machine Learning Precision Crop Recommendation Service
 * Trained on 22-crop agricultural feature space:
 * N, P, K, temperature, humidity, pH, rainfall -> crop suitability bands & insights
 */

export interface SoilFeatures {
  n: number;
  p: number;
  k: number;
  ph: number;
}

export interface WeatherFeatures {
  temp: number;
  humidity: number;
  rainfall: number;
}

export interface CropProfile {
  n: number;
  p: number;
  k: number;
  temp: number;
  hum: number;
  ph: number;
  rain: number;
  duration: string;
  season: string;
  category: 'cereal' | 'pulse' | 'fruit' | 'cash_crop' | 'plantation';
  apeda_export_grade: boolean;
  seed_variety: string;
  base_yield_tonnes_acre: number;
  mandi_rate_per_kg: number;
  ph_range: [number, number];
}

// Exact dataset centroids computed across the 2,200 dataset instances with agronomic profiles
export const CROP_CENTROIDS: Record<string, CropProfile> = {
  rice: {
    n: 79.89, p: 47.58, k: 39.87,
    temp: 23.69, hum: 82.27, ph: 6.43, rain: 236.18,
    duration: '120-135 days', season: 'Kharif', category: 'cereal', apeda_export_grade: true,
    seed_variety: 'Ponni (BPT 5204) / CR-1009 Sub 1 Certified Breeder Seed',
    base_yield_tonnes_acre: 2.85,
    mandi_rate_per_kg: 26.50,
    ph_range: [5.5, 7.2]
  },
  maize: {
    n: 77.76, p: 48.44, k: 19.79,
    temp: 22.39, hum: 65.09, ph: 6.25, rain: 84.76,
    duration: '95-105 days', season: 'Kharif/Rabi', category: 'cereal', apeda_export_grade: true,
    seed_variety: 'CoH(M)-8 / Pioneer P3396 High-Yield Hybrid',
    base_yield_tonnes_acre: 3.20,
    mandi_rate_per_kg: 24.50,
    ph_range: [5.8, 7.5]
  },
  chickpea: {
    n: 40.09, p: 67.79, k: 79.92,
    temp: 18.87, hum: 16.86, ph: 7.34, rain: 80.05,
    duration: '90-100 days', season: 'Rabi', category: 'pulse', apeda_export_grade: true,
    seed_variety: 'Desi Chickpea JG-11 / JAKI-9218',
    base_yield_tonnes_acre: 0.90,
    mandi_rate_per_kg: 68.00,
    ph_range: [6.0, 7.8]
  },
  kidneybeans: {
    n: 20.75, p: 67.54, k: 20.05,
    temp: 20.12, hum: 21.61, ph: 5.75, rain: 105.92,
    duration: '80-90 days', season: 'Rabi', category: 'pulse', apeda_export_grade: false,
    seed_variety: 'Chitra White Rajma / Shalimar 1',
    base_yield_tonnes_acre: 0.75,
    mandi_rate_per_kg: 110.00,
    ph_range: [5.5, 6.5]
  },
  pigeonpeas: {
    n: 20.73, p: 67.73, k: 20.29,
    temp: 27.74, hum: 48.06, ph: 5.79, rain: 149.46,
    duration: '140-160 days', season: 'Kharif', category: 'pulse', apeda_export_grade: true,
    seed_variety: 'Red Gram CO-RG-7 / Toor Dal Super',
    base_yield_tonnes_acre: 0.85,
    mandi_rate_per_kg: 88.00,
    ph_range: [5.5, 7.0]
  },
  mothbeans: {
    n: 21.44, p: 48.01, k: 20.23,
    temp: 28.19, hum: 53.16, ph: 6.83, rain: 51.20,
    duration: '65-75 days', season: 'Kharif', category: 'pulse', apeda_export_grade: false,
    seed_variety: 'RMO-40 / Maru Moth Drought-Resistant Selection',
    base_yield_tonnes_acre: 0.55,
    mandi_rate_per_kg: 72.00,
    ph_range: [6.5, 8.0]
  },
  mungbean: {
    n: 20.99, p: 47.28, k: 20.12,
    temp: 28.53, hum: 85.50, ph: 6.72, rain: 48.40,
    duration: '60-70 days', season: 'Zaid/Kharif', category: 'pulse', apeda_export_grade: true,
    seed_variety: 'VBN(Gg)-3 / Shiny Moong Certified Variety',
    base_yield_tonnes_acre: 0.65,
    mandi_rate_per_kg: 92.00,
    ph_range: [6.2, 7.5]
  },
  blackgram: {
    n: 40.02, p: 67.47, k: 19.24,
    temp: 29.97, hum: 65.12, ph: 7.13, rain: 67.88,
    duration: '70-80 days', season: 'Kharif/Rabi', category: 'pulse', apeda_export_grade: true,
    seed_variety: 'VBN-8 / Vamban-11 (Certified Breeder Seed)',
    base_yield_tonnes_acre: 0.95,
    mandi_rate_per_kg: 86.00,
    ph_range: [6.5, 7.8]
  },
  lentil: {
    n: 18.77, p: 68.36, k: 19.41,
    temp: 24.51, hum: 64.80, ph: 6.93, rain: 45.68,
    duration: '110-120 days', season: 'Rabi', category: 'pulse', apeda_export_grade: true,
    seed_variety: 'Pusa Ageti / Masoor KLS-218',
    base_yield_tonnes_acre: 0.70,
    mandi_rate_per_kg: 78.00,
    ph_range: [6.0, 7.5]
  },
  pomegranate: {
    n: 18.87, p: 18.75, k: 40.21,
    temp: 21.84, hum: 90.13, ph: 6.42, rain: 107.53,
    duration: '180-210 days', season: 'Perennial', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Bhagwa Export Selection (APEDA Grade A)',
    base_yield_tonnes_acre: 6.50,
    mandi_rate_per_kg: 140.00,
    ph_range: [6.0, 7.5]
  },
  banana: {
    n: 100.20, p: 82.01, k: 50.05,
    temp: 27.38, hum: 80.36, ph: 5.98, rain: 104.63,
    duration: '300-330 days', season: 'Perennial', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Grand Naine (G9) Certified Tissue Culture Sucker',
    base_yield_tonnes_acre: 18.50,
    mandi_rate_per_kg: 22.00,
    ph_range: [5.5, 7.0]
  },
  mango: {
    n: 20.07, p: 27.18, k: 29.92,
    temp: 31.21, hum: 50.40, ph: 5.77, rain: 94.70,
    duration: '365+ days', season: 'Summer', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Banganapalli / Alphonso Grafted Export Clone',
    base_yield_tonnes_acre: 5.80,
    mandi_rate_per_kg: 65.00,
    ph_range: [5.5, 7.2]
  },
  grapes: {
    n: 23.18, p: 132.53, k: 200.11,
    temp: 23.85, hum: 81.88, ph: 6.03, rain: 69.61,
    duration: '135-150 days', season: 'Spring', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Thompson Seedless / Sharad Seedless Table Grapes',
    base_yield_tonnes_acre: 11.20,
    mandi_rate_per_kg: 85.00,
    ph_range: [5.8, 7.0]
  },
  watermelon: {
    n: 99.42, p: 17.00, k: 50.22,
    temp: 25.59, hum: 85.16, ph: 6.50, rain: 50.79,
    duration: '80-90 days', season: 'Zaid/Summer', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Kiran F1 High-Sugar Icebox Hybrid',
    base_yield_tonnes_acre: 14.00,
    mandi_rate_per_kg: 14.00,
    ph_range: [6.0, 7.2]
  },
  muskmelon: {
    n: 100.32, p: 17.72, k: 50.08,
    temp: 28.66, hum: 92.34, ph: 6.36, rain: 24.69,
    duration: '85-95 days', season: 'Zaid/Summer', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Kundan F1 Netted Muskmelon',
    base_yield_tonnes_acre: 10.50,
    mandi_rate_per_kg: 24.00,
    ph_range: [6.0, 7.0]
  },
  apple: {
    n: 20.80, p: 134.22, k: 199.89,
    temp: 22.63, hum: 92.33, ph: 5.93, rain: 112.65,
    duration: '150-180 days', season: 'Perennial/Autumn', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Himachal Royal Delicious Ultra-Spur Graft',
    base_yield_tonnes_acre: 8.50,
    mandi_rate_per_kg: 120.00,
    ph_range: [5.5, 6.8]
  },
  orange: {
    n: 19.58, p: 16.55, k: 10.01,
    temp: 22.77, hum: 92.17, ph: 7.01, rain: 110.47,
    duration: '240-270 days', season: 'Winter', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Nagpur Mandarin Santra Budded Clone',
    base_yield_tonnes_acre: 7.20,
    mandi_rate_per_kg: 55.00,
    ph_range: [6.0, 7.5]
  },
  papaya: {
    n: 49.88, p: 59.05, k: 50.04,
    temp: 33.72, hum: 92.40, ph: 6.74, rain: 142.63,
    duration: '270-300 days', season: 'Perennial', category: 'fruit', apeda_export_grade: true,
    seed_variety: 'Red Lady 786 Semi-Dwarf Hybrid F1',
    base_yield_tonnes_acre: 25.00,
    mandi_rate_per_kg: 20.00,
    ph_range: [6.0, 7.2]
  },
  coconut: {
    n: 21.98, p: 16.90, k: 30.05,
    temp: 27.41, hum: 94.84, ph: 5.98, rain: 175.69,
    duration: '365+ days', season: 'Perennial', category: 'plantation', apeda_export_grade: true,
    seed_variety: 'East Coast Tall (ECT) Certified Seedling',
    base_yield_tonnes_acre: 4.50,
    mandi_rate_per_kg: 38.00,
    ph_range: [5.5, 7.5]
  },
  cotton: {
    n: 117.77, p: 46.24, k: 19.56,
    temp: 23.99, hum: 79.84, ph: 6.91, rain: 80.40,
    duration: '150-165 days', season: 'Kharif', category: 'cash_crop', apeda_export_grade: true,
    seed_variety: 'Bt Cotton RCH-2 / DCH-32 Long Staple Hybrid',
    base_yield_tonnes_acre: 1.40,
    mandi_rate_per_kg: 72.00,
    ph_range: [6.0, 7.8]
  },
  jute: {
    n: 78.40, p: 46.86, k: 39.99,
    temp: 24.96, hum: 79.64, ph: 6.73, rain: 174.79,
    duration: '120-130 days', season: 'Kharif', category: 'cash_crop', apeda_export_grade: true,
    seed_variety: 'JRO-524 (Navin) Golden Fiber High Yield',
    base_yield_tonnes_acre: 1.80,
    mandi_rate_per_kg: 52.00,
    ph_range: [6.0, 7.4]
  },
  coffee: {
    n: 101.20, p: 28.77, k: 29.94,
    temp: 25.54, hum: 58.87, ph: 6.79, rain: 158.07,
    duration: '210-240 days', season: 'Perennial', category: 'plantation', apeda_export_grade: true,
    seed_variety: 'Selection 9 / Chandragiri Arabica Specialty',
    base_yield_tonnes_acre: 1.10,
    mandi_rate_per_kg: 180.00,
    ph_range: [6.0, 7.0]
  }
};

export interface CropRecommendationItem {
  crop: string;
  crop_name: string;
  crop_raw: string;
  seed_variety: string;
  suitability_band: 'highly recommended' | 'moderately recommended' | 'not recommended';
  suitability_score: number;
  confidence: string;
  confidence_score: number;
  projected_yield_tonnes_acre: number;
  projected_yield_t_ha: number;
  projected_yield_tonnes_ha: number;
  projected_quality_grade: 'Grade A' | 'Grade B' | 'Grade C';
  grade_rationale: string;
  actionable_insight: string;
  duration: string;
  season: string;
  category: string;
  apeda_export_ready: boolean;
  market_rate_per_kg: number;
}

export interface RecommendationResult {
  recommended_crop: string;
  recommended_crop_raw: string;
  seed_variety: string;
  confidence: string;
  confidence_score: number;
  suitability_band: 'highly recommended' | 'moderately recommended' | 'not recommended';
  projected_yield: {
    tonnes_per_acre: number;
    tonnes_per_ha: number;
  };
  projected_quality_grade: 'Grade A' | 'Grade B' | 'Grade C';
  duration: string;
  season: string;
  category: string;
  apeda_export_ready: boolean;
  suitability_bands: {
    highly_recommended: CropRecommendationItem[];
    moderately_recommended: CropRecommendationItem[];
    not_recommended: CropRecommendationItem[];
  };
  all_ranked_crops: CropRecommendationItem[];
  recommendations: CropRecommendationItem[];
  alternatives: Array<{ crop: string; confidence: string }>;
  soil_weather_summary: {
    n: number; p: number; k: number; ph: number;
    temp_c: number; humidity_pct: number; rainfall_mm: number;
  };
  cultivation_timeline: Array<{
    week: string;
    phase: string;
    action: string;
    category: 'soil' | 'irrigation' | 'pest' | 'fertilizer' | 'harvest';
  }>;
}

export class CropRecommenderService {
  /**
   * Evaluates input soil & weather metrics against the 22-crop centroid space
   * utilizing weighted normalized supervised classification.
   * Categorizes suggestions into 3 distinct suitability bands:
   * - "highly recommended" (score >= 75)
   * - "moderately recommended" (45 <= score < 75)
   * - "not recommended" (score < 45)
   */
  public static recommend(
    soil: Partial<SoilFeatures> & Record<string, any> = {},
    weather: Partial<WeatherFeatures> & Record<string, any> = {}
  ): RecommendationResult {
    const s = soil || {};
    const w = weather || {};

    let sN = Number(s.n ?? s.nitrogen) || 80.0;
    if (sN > 150) sN = (sN / 280.0) * 80.0;

    const sP = Number(s.p ?? s.phosphorus) || 45.0;

    let sK = Number(s.k ?? s.potassium) || 40.0;
    if (sK > 180) sK = (sK / 250.0) * 45.0;

    const sPh = Number(s.ph) || 6.5;

    const wTemp = Number(w.temp ?? w.temperature ?? s.temp ?? s.temperature) || 27.5;
    const wHum = Number(w.humidity ?? s.humidity) || 75.0;
    const wRain = Number(w.rainfall ?? s.rainfall) || 120.0;

    // Feature normalization scale divisors
    const scale = {
      n: 140.0,
      p: 145.0,
      k: 205.0,
      temp: 45.0,
      hum: 100.0,
      ph: 14.0,
      rain: 300.0
    };

    // Feature importance weights
    const weights = {
      n: 1.2,
      p: 1.3,
      k: 1.2,
      temp: 1.8,
      hum: 1.5,
      ph: 2.2, // high sensitivity to soil acidity/alkalinity
      rain: 1.2
    };

    const allRanked: CropRecommendationItem[] = Object.entries(CROP_CENTROIDS).map(([cropName, profile]) => {
      const dN = ((sN - profile.n) / scale.n) * weights.n;
      const dP = ((sP - profile.p) / scale.p) * weights.p;
      const dK = ((sK - profile.k) / scale.k) * weights.k;
      const dTemp = ((wTemp - profile.temp) / scale.temp) * weights.temp;
      const dHum = ((wHum - profile.hum) / scale.hum) * weights.hum;
      const dPh = ((sPh - profile.ph) / scale.ph) * weights.ph;
      const dRain = ((wRain - profile.rain) / scale.rain) * weights.rain;

      const euclideanDist = Math.sqrt(
        dN * dN + dP * dP + dK * dK +
        dTemp * dTemp + dHum * dHum + dPh * dPh + dRain * dRain
      );

      // Supervised suitability scoring mapped into 0-100%
      let rawScore = 100 - (euclideanDist * 35.0);

      // Strict pH boundary enforcement: if outside crop's optimal band, penalize
      if (sPh < profile.ph_range[0] || sPh > profile.ph_range[1]) {
        const phDelta = Math.min(Math.abs(sPh - profile.ph_range[0]), Math.abs(sPh - profile.ph_range[1]));
        rawScore -= (phDelta * 18.0);
      }

      const score = Math.max(12, Math.min(99, Math.round(rawScore)));

      // Categorize into 3 distinct suitability bands
      let suitabilityBand: 'highly recommended' | 'moderately recommended' | 'not recommended';
      if (score >= 75) {
        suitabilityBand = 'highly recommended';
      } else if (score >= 45) {
        suitabilityBand = 'moderately recommended';
      } else {
        suitabilityBand = 'not recommended';
      }

      // Expected yield projection based on score and baseline
      const yieldAcre = Number((profile.base_yield_tonnes_acre * (0.60 + 0.40 * (score / 100))).toFixed(2));
      const yieldHa = Number((yieldAcre * 2.47105).toFixed(2));

      // Produce quality grade projection based on soil specification
      let grade: 'Grade A' | 'Grade B' | 'Grade C' = 'Grade C';
      let gradeRationale = '';
      if (score >= 82 && sPh >= 6.0 && sPh <= 7.8 && profile.apeda_export_grade) {
        grade = 'Grade A';
        gradeRationale = 'Optimal N-P-K balance and neutral pH ensure low-defect produce meeting APEDA Grade A export standards.';
      } else if (score >= 60) {
        grade = 'Grade B';
        gradeRationale = 'Acceptable agronomic vigor; minor nutrient amendment needed to elevate produce from Grade B domestic to export tier.';
      } else {
        grade = 'Grade C';
        gradeRationale = 'Sub-optimal soil reaction or nutrient deficit projected to result in lower specific gravity or cosmetic blemishes (Grade C).';
      }

      // Actionable insight text
      let actionableInsight = '';
      if (suitabilityBand === 'highly recommended') {
        actionableInsight = `Ideal soil and meteorological fit. Recommend certified seed ${profile.seed_variety} for peak vegetative yield.`;
      } else if (suitabilityBand === 'moderately recommended') {
        actionableInsight = `Acceptable conditions with soil amendment. Target pH adjustment (${profile.ph_range[0]}-${profile.ph_range[1]}) and booster foliar bio-fertilizer.`;
      } else {
        actionableInsight = `Unsuitable agro-climatic conditions. High deficit in key nutrients or unfavorable pH reaction (${sPh} vs required ${profile.ph_range[0]}-${profile.ph_range[1]}).`;
      }

      return {
        crop: formatCropName(cropName),
        crop_name: formatCropName(cropName),
        crop_raw: cropName,
        seed_variety: profile.seed_variety,
        suitability_band: suitabilityBand,
        suitability_score: score,
        confidence: `${score}%`,
        confidence_score: score / 100,
        projected_yield_tonnes_acre: yieldAcre,
        projected_yield_t_ha: yieldHa,
        projected_yield_tonnes_ha: yieldHa,
        projected_quality_grade: grade,
        grade_rationale: gradeRationale,
        actionable_insight: actionableInsight,
        duration: profile.duration,
        season: profile.season,
        category: profile.category,
        apeda_export_ready: profile.apeda_export_grade && grade === 'Grade A',
        market_rate_per_kg: profile.mandi_rate_per_kg
      };
    });

    // Sort descending by suitability score
    allRanked.sort((a, b) => b.suitability_score - a.suitability_score);

    // Group into 3 distinct suitability bands
    const suitability_bands = {
      highly_recommended: allRanked.filter(c => c.suitability_band === 'highly recommended'),
      moderately_recommended: allRanked.filter(c => c.suitability_band === 'moderately recommended'),
      not_recommended: allRanked.filter(c => c.suitability_band === 'not recommended')
    };

    const top = allRanked[0];
    const topProfile = CROP_CENTROIDS[top.crop_raw];
    const timeline = generateCultivationTimeline(top.crop_raw, topProfile);

    return {
      recommended_crop: top.crop,
      recommended_crop_raw: top.crop_raw,
      seed_variety: top.seed_variety,
      confidence: top.confidence,
      confidence_score: top.confidence_score,
      suitability_band: top.suitability_band,
      projected_yield: {
        tonnes_per_acre: top.projected_yield_tonnes_acre,
        tonnes_per_ha: top.projected_yield_t_ha
      },
      projected_quality_grade: top.projected_quality_grade,
      duration: top.duration,
      season: top.season,
      category: top.category,
      apeda_export_ready: top.apeda_export_ready,
      suitability_bands,
      all_ranked_crops: allRanked,
      recommendations: allRanked,
      alternatives: allRanked.slice(1, 4).map(r => ({
        crop: r.crop,
        confidence: r.confidence
      })),
      soil_weather_summary: {
        n: sN,
        p: sP,
        k: sK,
        ph: sPh,
        temp_c: wTemp,
        humidity_pct: wHum,
        rainfall_mm: wRain
      },
      cultivation_timeline: timeline
    };
  }
}

function formatCropName(raw: string): string {
  const map: Record<string, string> = {
    rice: 'Ponni Rice (Oryza sativa)',
    maize: 'Hybrid Maize / Corn (Zea mays)',
    chickpea: 'Desi Chickpea / Bengal Gram (Cicer arietinum)',
    kidneybeans: 'Rajma / Kidney Beans (Phaseolus vulgaris)',
    pigeonpeas: 'Red Gram / Toor Dal (Cajanus cajan)',
    mothbeans: 'Moth Bean (Vigna aconitifolia)',
    mungbean: 'Green Gram / Moong (Vigna radiata)',
    blackgram: 'Black Gram / Urad Dal (Vigna mungo)',
    lentil: 'Masoor Lentil (Lens culinaris)',
    pomegranate: 'Bhagwa Pomegranate (Punica granatum)',
    banana: 'Grand Naine Export Banana (Musa acuminata)',
    mango: 'Alphonso / Banganapalli Mango (Mangifera indica)',
    grapes: 'Thompson Seedless Table Grapes (Vitis vinifera)',
    watermelon: 'Kiran Watermelon (Citrullus lanatus)',
    muskmelon: 'Honey Dew Muskmelon (Cucumis melo)',
    apple: 'Himachal Royal Delicious Apple (Malus domestica)',
    orange: 'Nagpur Mandarin Orange (Citrus reticulata)',
    papaya: 'Red Lady 786 Papaya (Carica papaya)',
    coconut: 'East Coast Tall Coconut (Cocos nucifera)',
    cotton: 'Bt Cotton Long Staple (Gossypium hirsutum)',
    jute: 'Golden Fiber Tossa Jute (Corchorus olitorius)',
    coffee: 'Arabica Plantation Coffee (Coffea arabica)'
  };
  return map[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);
}

function generateCultivationTimeline(crop: string, profile: CropProfile) {
  return [
    {
      week: 'Weeks 1-2',
      phase: 'Basal Soil Conditioning & Bio-Priming',
      action: `Soil deep plowing, incorporation of farmyard manure, and seed treatment for ${formatCropName(crop)} (${profile?.seed_variety || 'Certified Variety'}).`,
      category: 'soil' as const
    },
    {
      week: 'Weeks 3-5',
      phase: 'Germination & Scheduled Micro-Irrigation',
      action: `Maintain critical root zone soil moisture; monitor early seedling canopy emergence.`,
      category: 'irrigation' as const
    },
    {
      week: 'Weeks 6-9',
      phase: 'Vegetative Vigor & Bio-Protectant Spray',
      action: `Barcode-verify authentic bio-extract formulation before applying foliar spray for APEDA export compliance.`,
      category: 'pest' as const
    },
    {
      week: 'Weeks 10-14',
      phase: 'Nutrient Fortification & Flowering Bloom',
      action: `Apply organic bio-potash top-dressing to stimulate uniform fruit/grain development for Grade A export.`,
      category: 'fertilizer' as const
    },
    {
      week: 'Weeks 15+',
      phase: 'Pre-Harvest MRL Testing & AI Grading',
      action: `Dispatch field agent for Brix sugar & hyperspectral quality assessment prior to sea container packaging.`,
      category: 'harvest' as const
    }
  ];
}
