const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const items = [
  { name: "30 mins Foot Massage", category: "30 Minutes Section", duration: 30, price: 30, intensity: "Gentle", bodyArea: "Foot", description: "A quick refresh: 5 mins head + 25 mins feet & legs. Gentle pressure to relax and refresh. Great for a lunch break reset." },
  { name: "30 mins Back Massage", category: "30 Minutes Section", duration: 30, price: 35, intensity: "Medium", bodyArea: "Back", description: "Focused back work to release knots and improve circulation. Good for desk tension and shoulder tightness." },
  { name: "Warmth Coast (90 mins)", category: "Signature", duration: 90, price: 98, intensity: "Medium", bodyArea: "Full body", description: "Chinese heating pack therapy + herbal foot bath + 50 mins back massage with essential oil + hot stone & deep tissue for deep relaxation." },
  { name: "Deep Sleep Package (60 mins)", category: "Packages", duration: 60, price: 58, intensity: "Gentle", bodyArea: "Full body", description: "Foot scrub (optional) + Chinese herb foot bath + hot stone + arm/hand/head-neck-shoulder massage. Calming and sleep-friendly." },
  { name: "Regular Combo (60 mins)", category: "Combos", duration: 60, price: 56, intensity: "Medium", bodyArea: "Customizable", description: "Chicago Style: 20m head/neck/shoulder/arms + 20m foot + 20m back. Balanced and popular choice." },
  { name: "Ginger Sun Package (70 mins)", category: "Packages", duration: 70, price: 68, intensity: "Deep", bodyArea: "Full body", description: "Saffron foot bath + foot massage (optional) + 40m back with oil + deep tissue + hot stone + 10m head/neck/shoulder. Energizing and warm." },
  { name: "Stress Relief (70 mins)", category: "Packages", duration: 70, price: 78, intensity: "Deep", bodyArea: "Full body", description: "Customized body massage with oil + deep tissue + hot stone + head/neck/shoulder. Stronger pressure for sore muscles." },
];
(async () => {
  for (const s of items) await p.service.create({ data: s });
  console.log("Seeded", items.length, "services.");
  await p.$disconnect();
})();
