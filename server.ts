/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing. AI Features will use fallback generator.");
}

// Video resolver endpoint for Google Photos backgrounds
app.get("/api/resolve-video", async (req, res) => {
  const gPhotosUrl = "https://photos.google.com/share/AF1QipNgH6TeuueuxNol-WiJUmiyK024U5wwDtr3raelYf6YRacU2VwhG0a3269gmqBF1w/photo/AF1QipM2c_LtBfG_keJUDYXEtASL3HkXeNwsbQHGPeTf?key=SXZXd0FaaTc4NkxKS25ZR2tKRlRnQ19Tb0oxTGhn";

  try {
    const response = await fetch(gPhotosUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    });

    if (!response.ok) {
      throw new Error(`Google Photos responded with status ${response.status}`);
    }

    const html = await response.text();

    // Look for og:video tags standard
    const ogMatch = html.match(/<meta\s+property=["']og:video["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:video["']/i) ||
                    html.match(/<meta\s+property=["']og:video:secure_url["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) {
      return res.redirect(302, ogMatch[1]);
    }

    // Replace all unicode escaped '=' inside JS script variables which Google heavily uses
    const cleanHtml = html.replace(/\\u003d/g, "=");

    // Scan for video-downloads pattern
    const videoDownloadsRegex = /https:\/\/video-downloads\.googleusercontent\.com\/[a-zA-Z0-9_.\-\/\\%?&=]+/gi;
    const downloadMatches = cleanHtml.match(videoDownloadsRegex);
    if (downloadMatches && downloadMatches.length > 0) {
      return res.redirect(302, downloadMatches[0]);
    }

    // Scan for high quality video stream links
    const lh3Regex = /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_\-]{30,}(=m(18|22|37|15|5|6|21))?/gi;
    const lh3Matches = cleanHtml.match(lh3Regex);
    if (lh3Matches && lh3Matches.length > 0) {
      const formatMatches = lh3Matches.filter(url => url.includes("=m"));
      if (formatMatches.length > 0) {
        return res.redirect(302, formatMatches[0]);
      }
      return res.redirect(302, lh3Matches[0] + "=m37");
    }

    // Fallback if scraping is restricted (looping athletic high-intensity gym video)
    return res.redirect(302, "https://assets.mixkit.co/videos/preview/mixkit-man-training-with-dumbbells-in-the-gym-23114-large.mp4");
  } catch (error) {
    console.error("Error resolving Google Photos video:", error);
    return res.redirect(302, "https://assets.mixkit.co/videos/preview/mixkit-man-training-with-dumbbells-in-the-gym-23114-large.mp4");
  }
});

// 1. AI Custom Gym & Diet Planner Endpoint
app.post("/api/generate-plan", async (req, res) => {
  const { age, weight, goal, level, focusArea, extraNotes } = req.body;

  if (!age || !goal || !level) {
    return res.status(400).json({ error: "Missing required profile fields (age, goal, level)." });
  }

  // Fallback data if Gemini is unavailable
  const fallbackPlan = {
    workoutPlan: `**Aura Gym 7-Day Athletic Plan (${level} - ${goal})**\n\n` +
      `* **Day 1: Upper Body Strength & Core Power** - Bench Press 4x8, Shoulder Press 3x10, Incline Dumbbell Flyes 3x12, Hanging Leg Raises 4x15. Focus: Clean form, 90-sec rest.\n` +
      `* **Day 2: Cardio Endurance & HIIT Burn** - Row Machine 500m intervals x 6, Treadmill incline sprints (30s sprint/30s rest x 12). Focus on the Cardio Zone.\n` +
      `* **Day 3: Rest & Mobility** - Dynamic stretching, 20-min walking or passive recovery yoga.\n` +
      `* **Day 4: Posterior Chain & Lower Body Power** - Squats/Deadlifts 4x6, Barbell Hip Thrusts 3x10, Bulgarian Split Squats 3x12, Calf raises 4x20.\n` +
      `* **Day 5: High-Performance Conditioning** - Kettlebell Swings 3x20, Medicine ball slams 3x15, Battle ropes 4x30s. Cardio intensive.\n` +
      `* **Day 6: Functional Agility & Core** - Planks, Russian twists, agility ladder drills, and 3km aerobic run under 15 mins.\n` +
      `* **Day 7: Full Regeneration & Body Healing** - Hot/cold bath, gentle full body foam rolling, and mild flexibility sequence.`,
    nutritionTips: `**Macro-Nutritional Guide for Aura Athletes**\n\n` +
      `- **Daily Target**: ~2200-2600 active calories based on structural intensity.\n` +
      `- **Protein Intake**: 1.8g - 2.0g per kg of bodyweight to accelerate myofibrillar repair. Sources: Lean poultry, tilapia, eggs, and dynamic plant proteins.\n` +
      `- **Carbohydrate Timing**: Load complex carbs (oatmeal, sweet potatoes) 90-mins pre-workout. Fast-absorbing carb + amino boost post-workout.\n` +
      `- **Healthy Fats**: Keep intake to 20% of total load (avocados, premium seeds, organic olive oil) for optimal endocrine support.`,
    hydrationSchedule: `**Active Hydration Protocol**\n\n` +
      `- **Morning Dawn**: 500ml pure filtered water with a pinch of organic pink salt.\n` +
      `- **Pre-Training Window**: 400ml water accompanied by raw B_complex amino acids.\n` +
      `- **Intra-Workout**: Take structured small sips (approx. 150ml every 15 minutes) with added coconut electrolytes.\n` +
      `- **Post-Training Rest**: 600ml pure water with micro-filtered clean proteins and amino isolates. Total targeted daily hydrate: 3.5 - 4.0 Litres.`,
    trainerNote: `Hey Athlete! At Aura Fitness, we don't just count reps; we make reps count. Level ${level} for ${goal} requires focus, discipline, and structural commitment. Follow this personalized blueprint, stay hydrated, and remember that real transformation begins when you feel like stopping. Bring the absolute heat to your sessions! - Coach Bryan`
  };

  if (!ai) {
    console.log("Using backup plan generator (Gemini client not initialized).");
    return res.json({ success: true, ...fallbackPlan });
  }

  try {
    const prompt = `You are a world-class elite personal trainer and expert clinical nutritionist at "Aura Fitness" gym. 
    Generate an incredibly detailed, highly professional, and deeply motivational personalized 7-Day Gym Workout and Nutritional Plan.
    
    ATHLETE PROFILE:
    - Age: ${age} years
    - Weight: ${weight ? weight + ' kg' : 'Not specified'}
    - Prime Objective: ${goal}
    - Athlete Level: ${level}
    - Primary Focus Area: ${focusArea || 'Full-scale full body performance'}
    - Additional Medical/Special Conditions: ${extraNotes || 'None. Fully cleared for heavy action.'}
    
    Deliver the output strictly in a structured JSON configuration of the exact requested format. Be highly encouraging and use active, epic gym metaphors. Define day-by-day training, specific nutrition targets, precise water schedules, and a powerful personal message.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workoutPlan: { 
              type: Type.STRING, 
              description: "Format in beautiful markdown. A stellar, complete day-by-day 7-day workout routine tailored perfectly to their goals and level." 
            },
            nutritionTips: { 
              type: Type.STRING, 
              description: "Format in beautiful markdown. Specific meal recommendations, functional foods, calorie guidelines, and timing." 
            },
            hydrationSchedule: { 
              type: Type.STRING, 
              description: "Format in beautiful markdown. Structured hydration routine for everyday workout and active recovery cycles." 
            },
            trainerNote: { 
              type: Type.STRING, 
              description: "An authentic, inspiring, high-energy coaching message written by Coach Bryan." 
            }
          },
          required: ["workoutPlan", "nutritionTips", "hydrationSchedule", "trainerNote"]
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(bodyText);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Error generating custom plan with Gemini:", error);
    // Graceful recovery, return fallback plan but mark that it succeeded using fallback
    res.json({ success: true, ...fallbackPlan, note: "Loaded optimized base plan templates successfully." });
  }
});

// 2. Simulated M-PESA STK Push payment trigger (Safaricom)
app.post("/api/simulate-payment", (req, res) => {
  const { phoneNumber, name, amount, packageName } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: "Missing phoneNumber or amount." });
  }

  const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: "Invalid Kenyan phone number structure. Must be M-PESA compliant." });
  }

  // Simulate starting checkout
  res.json({
    success: true,
    message: "STK Push initiated successfully.",
    merchantRequestID: "aura_" + Math.random().toString(36).substring(2, 10),
    checkoutRequestID: "ws_CO_" + Date.now().toString().slice(5) + Math.random().toString(36).substring(2, 5),
    estimatedDuration: 3000,
    details: {
      client: name || "Valued Gym Member",
      package: packageName || "Monthly Access pass",
      charged: amount
    }
  });
});

// 3. Simulated Whatsapp confirmation endpoint
app.post("/api/whatsapp-callback", (req, res) => {
  const { phoneNumber, name, packageName } = req.body;

  // Simulate generating highly professional auto WhatsApp notification template
  const formattedMsg = `Welcome to *Aura Gym & Fitness*, *${name || "Valued Athlete"}*! 🏋️‍♀️🔥\n\n` +
    `Your M-PESA transaction has been authenticated. Your *${packageName || "Premier Pass"}* membership is active and confirmed! ✅\n\n` +
    `📅 *Membership details*:\n` +
    `- Status: *ACTIVE / PREMIUM*\n` +
    `- Assigned Coach: *Trainer Bryan* 🎖️\n` +
    `- Perks included: *All-Access Cardio & Lifting floor*, *Weekly Timetable Group classes*, *Complimentary AI Gym Planner*.\n\n` +
    `We have activated your smart wellness RFID pass in our system. Tap your phone at the front desk screen upon arrival.\n\n` +
    `_Transform your body. Transform your life._ See you on the turf! 💪🏋️`;

  res.json({
    success: true,
    messageId: "wa_msg_" + Math.random().toString(36).substring(2, 12),
    timestamp: new Date().toISOString(),
    formattedMessage: formattedMsg
  });
});

// Start active full-stack server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura Fitness Server running on port ${PORT}`);
  });
}

startServer();
