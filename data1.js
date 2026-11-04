/* EcoBite content, part 1: helpers, level metadata, Levels 1 to 3.
   Benchmarks come from the EcoBite framework document. Scenario quantities are simplified teaching parameters. */
window.ECO = window.ECO || {};
(function (E) {
  E.M = function (label, val, target, dir, fmt) {
    fmt = fmt || function (x) { return String(Math.round(x * 10) / 10); };
    var ok = dir === "min" ? val >= target : dir === "max" ? val <= target : val < target;
    var att = dir === "min" ? Math.min(1, target ? val / target : 1) : (val <= target ? 1 : Math.max(0, 1 - (val - target) / Math.max(target, 1)));
    return { label: label, value: fmt(val), target: (dir === "min" ? "≥ " : dir === "max" ? "≤ " : "< ") + fmt(target), ok: ok, att: att };
  };
  E.pct = function (x) { return Math.round(x * 10) / 10 + "%"; };
  E.levels = [
    { n: 1, key: "Novice", title: "The Waste & Materials Warden", audience: "BDS 1 to 2 (pre-clinical)", color: "#2f7d4f", log: "Carbon Literacy Log",
      objective: "Move from passive awareness to operational competence in clinical waste streams, single-use plastic (SUP) tracking and mercury hygiene.",
      framing: "Orbit 1: the operatory floor. Every bag is a decision about incineration, recycling and mercury." },
    { n: 2, key: "Intermediate", title: "The Chairside Eco-Clinician", audience: "BDS 3 (clinical skills)", color: "#1d7c8c", log: "CSH 4 Principles Reflection",
      objective: "Apply the CSH four principles (Prevention, Patient Empowerment, Lean Care, Low-carbon Alternatives) at the chairside.",
      framing: "Orbit 2: the treatment plan. Prevention is the lowest-carbon procedure there is." },
    { n: 3, key: "Advanced", title: "The Care Pathway Architect", audience: "BDS 4 to 5 and senior interns", color: "#b8862a", log: "Care Pathway Audit Report",
      objective: "Tackle travel, the largest carbon hotspot of primary dental care, and widen history-taking to ecosystemic determinants of health.",
      framing: "Orbit 3: the care pathway. The journey to the clinic can outweigh the visit itself." },
    { n: 4, key: "Expert", title: "The Green Clinic Director & Policy Leader", audience: "Postgraduates, residents, faculty", color: "#7a4fa3", log: "SusQI Hospital Report",
      objective: "Run facility-wide SusQI audits, ethical procurement and institutional benchmarking against the Planetary Health Report Card.",
      framing: "Orbit 4: the institution. Systems, budgets and benchmarks decide what students can practise." },
    { n: 5, key: "Master", title: "The Planetary Health Pioneer & Global Reformer", audience: "Global leaders, WHO and FDI groups, ministry advisors", color: "#c0562f", log: "Planetary Health Leadership Brief",
      objective: "Drive treaty negotiation, supply chain decarbonisation and One Health policy at system scale.",
      framing: "Orbit 5: the biosphere. Policy and industry change reach every chair at once." }
  ];
  E.games = [];

  /* ---------- LEVEL 1 ---------- */
  E.games.push({
    id: "1.1", level: 1, engine: "sort", title: "Operatory Sorting Speed-Run",
    brief: "Phantom-head set-up waste is piling up. Sort each item into the correct stream before the timer runs out. Unsoiled paper and packaging in the Yellow SW404 stream is sent to high-temperature incineration (850 to 1,100 °C), so it costs money and carbon.",
    learn: ["4-stream waste classification", "Cost and carbon of incineration"],
    start: { c: 100, b: 60 }, ref: { b0: 60, e0: 16.8 }, scale: 80,
    bins: [
      { id: "sw404", name: "Yellow SW404", sub: "infectious, soiled with blood or saliva", color: "#d9a400" },
      { id: "sharps", name: "Rigid sharps", sub: "ISO 23907 container", color: "#c0562f" },
      { id: "blue", name: "Light blue", sub: "autoclave or reprocess first", color: "#3f8fd2" },
      { id: "recycle", name: "Municipal recycling", sub: "clean, unsoiled paper, card, glass", color: "#2f7d4f" }
    ],
    items: [
      ["Blood-soaked gauze", "sw404"], ["Saliva-contaminated cotton rolls", "sw404"], ["Used disposable suction tip", "sw404"],
      ["Blood-stained patient bib", "sw404"], ["Rubber dam sheet with blood", "sw404"], ["Used disposable saliva ejector", "sw404"], ["Blood-contaminated gloves", "sw404"],
      ["Used local anaesthetic needle", "sharps"], ["Scalpel blade", "sharps"], ["Fractured endodontic file", "sharps"], ["Used suture needle", "sharps"], ["Used matrix band", "sharps"],
      ["Used reusable instrument cassette", "blue"], ["Used handpiece awaiting sterilisation", "blue"], ["Used reusable impression tray", "blue"],
      ["Unsoiled paper backing from a sterile pouch", "recycle"], ["Clean outer glove-box cardboard", "recycle"], ["Clean paper instrument sleeve", "recycle"],
      ["Clean cotton-roll carton", "recycle"], ["Empty clean irrigant glass bottle", "recycle"], ["Unopened-kit paper insert", "recycle"]
    ],
    ev: "Segregation by risk, not by habit: only genuinely infectious waste needs the costly SW404 route.",
    goalText: "Segregation error rate of 5.0% or less.",
    goal: function (r) {
      var err = r.total ? (r.wrong / r.total) * 100 : 100;
      return { pass: err <= 5 && r.c >= 80, metrics: [E.M("Biohazard segregation error rate", err, 5, "max", E.pct)],
        lines: ["You sorted " + (r.total - r.wrong) + " of " + r.total + " items correctly.",
          r.recycNo404 ? r.recycNo404 + " clean item(s) went into SW404 and were sent for high-temperature incineration." : "No clean packaging was incinerated."] };
    }
  });

  E.games.push({
    id: "1.2", level: 1, engine: "pouch", title: "Chairside Pouch Splitter & SUP Audit",
    brief: "Phase A: peel unsoiled paper from the plastic film of sterile pouches opened before patient contact, and send paper to recycling. Pouches that touched the contaminated zone go whole to SW404. Phase B: audit a procedure set-up and swap single-use plastic for safe alternatives to get under the 21-item benchmark.",
    learn: ["Pouch paper and film separation", "SUP counting against the 21 item / 354 g benchmark"],
    start: { c: 100, b: 50 }, ref: { b0: 50, e0: 16 }, scale: 60,
    pouches: [false, false, true, false, false, false, true, false, false, false, false, false],
    sup: [
      ["Disposable mirror", 1, "Reusable stainless mirror (autoclaved)", true], ["Disposable tweezers", 1, "Reusable tweezers", true], ["Disposable probe", 1, "Reusable probe", true],
      ["Plastic patient cup", 2, "Reusable cup or paper cup if cleaned and recycled", true], ["Plastic bib clip chain", 1, "Reusable autoclavable bib chain", true], ["Plastic barrier film, chair", 4, "Wipe-clean surfaces with risk-based disinfection", true],
      ["Plastic handle covers", 5, "Autoclavable handle sleeves", true], ["Single-use cotton-roll dispenser sleeve", 1, "Reusable dispenser", true], ["Plastic-wrapped cotton rolls (individual)", 3, "Bulk pack, decant to reusable pot", true],
      ["Plastic saliva ejector", 1, "Biodegradable or reusable ejector where available", true], ["Plastic air-water syringe tip", 1, "Autoclavable metal tip", true], ["Single-use plastic tray cover", 4, "Autoclavable tray", true],
      ["Disposable plastic mixing pad", 2, "Paper pad", true], ["Plastic-handled applicator (disposable)", 3, "Reusable applicator", true], ["Sterile single-use endodontic file", 1, "Reuse after home-made cleaning", false],
      ["Single-use LA needle", 1, "Resheath and reuse on next patient", false], ["Sterile surgical drape", 1, "Reuse unsterile drape", false], ["Sterile single-use irrigation syringe", 1, "Reuse without sterilising", false]
    ],
    ev: "Benchmark from the EcoBite framework: 21 SUP items (354 g) per procedure. Infection control items are never traded away.",
    goalText: "Divert at least 90% of unsoiled pouch paper and keep SUP items below 21.",
    goal: function (r) {
      var div = r.cleanTotal ? (r.divert / r.cleanTotal) * 100 : 0;
      return { pass: div >= 90 && r.supCount < 21 && r.c >= 80,
        metrics: [E.M("Pouch paper diverted", div, 90, "min", E.pct), E.M("SUP items per procedure", r.supCount, 21, "lt", function (x) { return Math.round(x); })],
        lines: ["Baseline set-up: " + r.supBase + " SUP items. Your set-up: " + r.supCount + " items (about " + Math.round(r.supCount * 354 / 21) + " g at the benchmark ratio).",
          r.unsafe ? r.unsafe + " unsafe swap(s) compromised infection control." : "All swaps preserved infection control."] };
    }
  });

  E.games.push({
    id: "1.3", level: 1, engine: "scenario", title: "Minamata & Biomaterials LCA Matrix",
    brief: "Apply the Minamata Convention measures on dental amalgam and compare restorative materials by life cycle, not by habit.",
    learn: ["Encapsulated amalgam handling", "ISO 11143 separators (95% mercury retention)", "Prevention and material life-cycle thinking"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 30 }, scale: 12,
    goalText: "Choose the best option in at least 4 of 5 decisions while keeping clinical integrity at 80% or more.",
    steps: [
      { title: "The separator log", text: "Your amalgam separator has not been serviced for 18 months. Chairside suction still works. What do you do?",
        opts: [
          { t: "Service or replace it to the manufacturer schedule and confirm it meets ISO 11143 (at least 95% retention).", good: true, d: { b: -10, f: 0.5, c: 0 }, fb: "Separators only protect wastewater when maintained. ISO 11143 sets the test for retention efficiency of at least 95%.", ev: "ISO 11143; Minamata Convention Annex A Part II" },
          { t: "Leave it. Composite use is rising, so mercury is a shrinking problem.", good: false, d: { f: 4, c: -5 }, fb: "Amalgam is still placed and removed. Removal of old restorations is a major mercury source." },
          { t: "Remove the separator so the suction does not clog.", good: false, d: { f: 8, c: -10 }, fb: "Removing the separator sends mercury-laden particles straight to the sewer." }] },
      { title: "Scrap amalgam", text: "You remove an old amalgam restoration and have scrap and a spent capsule. Where does it go?",
        opts: [
          { t: "Sealed, labelled contact-amalgam container for mercury recovery.", good: true, d: { b: -2, f: 0.2 }, fb: "Contact and non-contact amalgam should go to a dedicated recovery stream, never to general or clinical waste.", ev: "Minamata Convention; local hazardous waste rules" },
          { t: "Yellow SW404 bag.", good: false, d: { f: 5, c: -5 }, fb: "Incineration vaporises mercury. It does not belong in the SW404 stream." },
          { t: "Down the sink with plenty of water.", good: false, d: { f: 9, c: -12 }, fb: "Direct discharge is the exact pathway the Convention seeks to close." }] },
      { title: "Choose the lowest-impact path", text: "A low caries-risk adult has a small, non-cavitated occlusal lesion visible on a bitewing. Which option has the lowest lifetime impact?",
        opts: [
          { t: "Remineralise, coach on diet and brushing, and monitor.", good: true, d: { b: -2, f: 0.3, s: 4 }, fb: "No restoration means no material, no replacement cycle and fewer trips. Prevention first is CSH principle number one.", ev: "CSH four principles" },
          { t: "Place an amalgam restoration because it lasts.", good: false, d: { f: 6, c: -6, b: -4 }, fb: "Restoring an early lesion starts the restorative cycle and adds mercury." },
          { t: "Place a composite restoration to be safe.", good: false, d: { f: 3, c: -4, b: -6 }, fb: "Better than amalgam environmentally, but avoidable for a lesion that can be arrested." }] },
      { title: "Cleaning the suction lines", text: "Which cleaning approach is appropriate for suction lines connected to an amalgam separator?",
        opts: [
          { t: "Use a separator-compatible, non-chlorine cleaner as specified by the manufacturer.", good: true, d: { b: -3, f: 0.2 }, fb: "Chlorine-based cleaners can dissolve and mobilise mercury, so manufacturers specify compatible products.", ev: "Separator manufacturer guidance" },
          { t: "Daily bleach flush to disinfect.", good: false, d: { f: 5, c: -8 }, fb: "Bleach can mobilise mercury and damage the separator." },
          { t: "Never clean the lines to save chemicals.", good: false, d: { f: 2, c: -8 }, fb: "Poorly maintained lines raise infection and equipment risks." }] },
      { title: "Life-cycle matrix", text: "A posterior filling is genuinely needed in a patient with high caries risk and limited access to care. Which choice balances clinical, social and environmental value best?",
        opts: [
          { t: "Selective caries removal with a glass-ionomer or composite restoration, plus a prevention plan.", good: true, d: { b: -8, f: 2, s: 6 }, fb: "Mercury-free alternatives plus a prevention plan reduce repeat treatment. Material choice matters less than preventing the next cycle.", ev: "Minamata mercury-free alternatives; MID principles" },
          { t: "Amalgam because it is cheapest per tooth.", good: false, d: { f: 6, c: -4 }, fb: "Lowest unit cost ignores mercury and the longer-term cost of environmental harm." },
          { t: "Extract the tooth to avoid materials altogether.", good: false, d: { f: 4, c: -15, s: -6 }, fb: "Tooth loss is a clinical and social harm and often leads to prosthetics later." }] }
    ],
    goal: function (r) {
      return { pass: r.good >= 4 && r.c >= 80, metrics: [E.M("Best decisions", r.good, 4, "min", function (x) { return Math.round(x) + " / 5"; })],
        lines: ["Remember the order: prevent, then use mercury-free restorative options, then manage mercury safely where it still exists."] };
    }
  });

  /* ---------- LEVEL 2 ---------- */
  E.games.push({
    id: "2.1", level: 2, engine: "scenario", title: "Restorative Cycle Breakout",
    brief: "Eight patients, eight early decisions. Choose between aggressive G.V. Black style restoration and minimally invasive options. Then seat one restoration with a margin gap below 50 µm.",
    learn: ["Minimally invasive dentistry", "Breaking the restorative cycle", "Precision restoration fit"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 40 }, scale: 16,
    goalText: "Arrest at least 85% of early lesions non-invasively, keep clinical integrity at 80% or more, and seat a restoration with a gap under 50 µm.",
    steps: [
      { title: "Patient 1", early: true, text: "19-year-old, white-spot lesion on a smooth surface, good access, no cavitation.", opts: [
        { t: "Fluoride varnish, diet and brushing coaching, review in 3 months.", good: true, d: { f: 0.4, b: -3, s: 4 }, fb: "Non-cavitated lesions can be remineralised. Prevention and patient empowerment.", ev: "CSH principles 1 and 2" },
        { t: "Drill and fill to be safe.", good: false, d: { f: 6, b: -9, c: -4 }, fb: "Cutting healthy tissue starts the restorative cycle." },
        { t: "Do nothing and discharge.", good: false, d: { f: 0.2, c: -6 }, fb: "An active lesion without management will progress." }] },
      { title: "Patient 2", early: true, text: "7-year-old, newly erupted first molar with deep sound fissures, high caries risk.", opts: [
        { t: "Resin fissure sealant.", good: true, d: { f: 0.5, b: -4, s: 3 }, fb: "Sealants are a low-carbon, high-value preventive procedure.", ev: "MID; sealant evidence" },
        { t: "Preventive resin restoration with bur preparation.", good: false, d: { f: 3, b: -7, c: -3 }, fb: "Preparing sound fissures is unnecessary." },
        { t: "Wait until a cavity appears.", good: false, d: { f: 1, c: -8 }, fb: "High-risk fissures should be protected early." }] },
      { title: "Patient 3", early: true, text: "5-year-old, anxious, asymptomatic cavitated dentine lesion in a primary molar, no pulpal signs.", opts: [
        { t: "Silver diamine fluoride with review and parent coaching.", good: true, d: { f: 0.4, b: -3, s: 5 }, fb: "SDF arrests lesions without drilling or aerosol and suits behaviour-limited children. Staining should be discussed in consent.", ev: "MID; SDF" },
        { t: "General anaesthesia for full restoration.", good: false, d: { f: 15, b: -30, c: -8 }, fb: "GA carries a major footprint and risk for a manageable lesion." },
        { t: "Extract it.", good: false, d: { f: 3, c: -10 }, fb: "Premature loss of a primary molar has consequences." }] },
      { title: "Patient 4", early: true, text: "Interproximal radiographic lesion confined to the outer half of enamel, low-moderate risk adult.", opts: [
        { t: "Non-operative: fluoride, interdental cleaning, diet advice, repeat bitewing at risk-based interval.", good: true, d: { f: 0.4, b: -3, s: 3 }, fb: "Enamel lesions do not need cutting.", ev: "Risk-based recall; MID" },
        { t: "Proximal slot preparation and restoration.", good: false, d: { f: 5, b: -9, c: -5 }, fb: "Over-treatment of enamel lesions." },
        { t: "Take new radiographs every 6 months for all.", good: false, d: { f: 1.5, c: -3 }, fb: "Routine fixed-interval imaging adds dose and footprint without need." }] },
      { title: "Patient 5", early: true, text: "Adult with accessible cavitated occlusal dentine lesion, asymptomatic, wants a smooth surface.", opts: [
        { t: "Selective caries removal and a minimal adhesive or glass-ionomer restoration.", good: true, d: { f: 2, b: -8, s: 3 }, fb: "When a restoration is needed, keep it minimal and avoid extension for prevention.", ev: "MID; selective caries removal" },
        { t: "Extensive G.V. Black cavity with extension for prevention.", good: false, d: { f: 7, b: -12, c: -5 }, fb: "Outdated, destructive and carbon-heavy." },
        { t: "SDF only and no review.", good: false, d: { f: 0.4, c: -6 }, fb: "Without access and follow-up this risks progression." }] },
      { title: "Patient 6", early: true, text: "78-year-old with xerostomia and active, leathery root caries lesions.", opts: [
        { t: "High-fluoride toothpaste, SDF, saliva management and medication review.", good: true, d: { f: 0.6, b: -4, s: 5 }, fb: "Arrest and manage risk factors instead of cutting root surface.", ev: "MID; older adult care" },
        { t: "Multiple root-surface restorations at once.", good: false, d: { f: 8, b: -14, c: -6 }, fb: "High failure and heavy footprint." },
        { t: "Extract affected teeth.", good: false, d: { f: 3, c: -12 }, fb: "Avoidable tooth loss." }] },
      { title: "Patient 7", early: true, text: "Early lesion beside a failing but repairable restoration margin.", opts: [
        { t: "Repair or reseal the restoration and treat the lesion.", good: true, d: { f: 1.2, b: -4 }, fb: "Repair extends restoration life and saves tooth tissue, materials and visits.", ev: "Repair over replacement" },
        { t: "Remove the whole restoration and redo.", good: false, d: { f: 6, b: -11, c: -4 }, fb: "Replacement escalates the restorative cycle." },
        { t: "Ignore the margin.", good: false, d: { f: 0.5, c: -6 }, fb: "A failing margin allows secondary caries." }] },
      { title: "Patient 8 (clinical safeguard)", text: "Adult with a deep lesion and spontaneous night pain, lingering to cold. Which option is correct?", opts: [
        { t: "Diagnose probable irreversible pulpitis and arrange definitive pulp treatment.", good: true, d: { f: 2, b: -8 }, fb: "Not every patient is a prevention case. Minimally invasive does not mean non-invasive when disease has reached the pulp.", ev: "Clinical safety floor" },
        { t: "Apply SDF and send them home.", good: false, d: { c: -25, f: 0.4 }, fb: "This would mismanage irreversible pulp disease." },
        { t: "Prescribe antibiotics and review in two weeks.", good: false, d: { c: -22, f: 0.6 }, fb: "Antibiotics do not treat irreversible pulpitis." }] },
      { title: "Seat the restoration", type: "fit", text: "A single restoration is needed after all. Stop the moving reticle on the margin line. You have three attempts. The best attempt counts." }
    ],
    goal: function (r) {
      var early = r.earlyTotal || 7, arrested = r.earlyGood || 0, a = (arrested / early) * 100, fit = r.fitBest == null ? 999 : r.fitBest;
      return { pass: a >= 85 && fit < 50 && r.c >= 80, metrics: [E.M("Early lesions arrested non-invasively", a, 85, "min", E.pct), E.M("Restoration margin gap", fit, 50, "lt", function (x) { return x === 999 ? "none" : Math.round(x) + " µm"; })],
        lines: ["Repeated restoration is the engine of the restorative cycle. Illustrative 40-year projection below."], chart: "spiral" };
    }
  });

  E.games.push({
    id: "2.2", level: 2, engine: "scenario", title: "Digital vs Analogue Workflow Clash",
    brief: "Compare workflows stage by stage. Digital is not automatically greener: utilisation, energy and the clinical indication decide.",
    learn: ["Life-cycle trade-offs", "Justification of imaging", "Low-carbon alternatives (CSH principle 4)"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 30 }, scale: 15,
    goalText: "Choose the best option in at least 4 of 5 decisions while keeping clinical integrity at 80% or more.",
    steps: [
      { title: "Impressions for a single crown", text: "Your clinic has a shared intraoral scanner used about 20 times a week. The lab accepts digital files.", opts: [
        { t: "Use the intraoral scanner and send the file to the lab.", good: true, d: { f: 1.2, b: -6, s: 2 }, fb: "Avoids impression materials, trays, gypsum and courier trips, and reduces remakes when utilisation is good.", ev: "Digital workflow LCAs; evidence mixed, depends on use" },
        { t: "Alginate and polyether impression with courier.", good: false, d: { f: 5, b: -8, c: -2 }, fb: "Disposable trays, materials and transport add up." },
        { t: "Buy a second dedicated scanner for each chair.", good: false, d: { f: 4, b: -25 }, fb: "Embodied carbon and cost with low utilisation can outweigh the benefit." }] },
      { title: "Bitewing imaging", text: "A low-risk adult is attending for a routine check. Last bitewings were 12 months ago with no caries.", opts: [
        { t: "No bitewings today. Use a risk-based interval.", good: true, d: { f: 0.1, s: 2 }, fb: "The greenest image is the one not clinically justified. It also avoids unnecessary dose.", ev: "Justification, FDI sustainability principles" },
        { t: "Take digital bitewings anyway.", good: false, d: { f: 1, c: -4 }, fb: "Digital sensors cut chemistry but do not justify the exposure." },
        { t: "Take film bitewings with chemical processing.", good: false, d: { f: 3, c: -5, b: -4 }, fb: "Unneeded dose plus chemistry and silver waste." }] },
      { title: "Image storage", text: "The clinic still prints and files images and referral letters. What next?", opts: [
        { t: "Move to secure digital records and referral transfer.", good: true, d: { f: -1, b: -6 }, fb: "Removes paper, toner and postage, and speeds care. Include data governance and energy-efficient hosting.", ev: "Digital pathways" },
        { t: "Print two copies for safety.", good: false, d: { f: 2, b: -2 }, fb: "Duplicates paper without any added safety." },
        { t: "Courier all images on discs.", good: false, d: { f: 4, b: -6 }, fb: "Courier and discs are high-impact." }] },
      { title: "Lab communication", text: "A lab requests a shade check and design approval.", opts: [
        { t: "Share a digital design and photographs, hold a short video review.", good: true, d: { f: -0.5, b: -1 }, fb: "Replaces a trip with a call when clinical judgement allows.", ev: "Travel hotspot" },
        { t: "Hand-deliver the case to the lab by car.", good: false, d: { f: 6, b: -4 }, fb: "Staff travel is part of the hotspot." },
        { t: "Skip the design check.", good: false, d: { f: 0, c: -10 }, fb: "Skipping quality steps raises remakes." }] },
      { title: "Scanner replacement", text: "The old scanner is slow but functional. The vendor offers a trade-in.", opts: [
        { t: "Repair or upgrade software and extend its life, then plan replacement when needed.", good: true, d: { f: 0.5, b: -4 }, fb: "Buy Less, Buy Better: extend use of working equipment.", ev: "Circular procurement" },
        { t: "Replace it now to keep up with trends.", good: false, d: { f: 5, b: -20 }, fb: "Embodied carbon of new hardware is substantial." },
        { t: "Discard to general waste.", good: false, d: { f: 3, c: -2, b: -2 }, fb: "E-waste needs a proper route." }] }
    ],
    goal: function (r) {
      return { pass: r.good >= 4 && r.c >= 80, metrics: [E.M("Best decisions", r.good, 4, "min", function (x) { return Math.round(x) + " / 5"; })],
        lines: ["Rule of thumb: remove an unneeded step first, then substitute a lower-carbon step, then optimise the remainder."] };
    }
  });

  E.games.push({
    id: "2.3", level: 2, engine: "n2o", title: "Nitrous Oxide & Anaesthetic Stewardship",
    brief: "Set sedation parameters for three patients. Nitrous oxide has a global warming potential of roughly 273 to 298 times CO2. Reduce clinical emissions by at least 70% against the default setting (6 L/min, 50%) without under- or over-sedating anyone.",
    learn: ["Titrating to effect", "Leak control", "Catalytic cracking abatement"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 113.4 }, scale: 10,
    gwp: 273, base: { flow: 6, conc: 50 },
    patients: [
      { name: "Child, 8 years, anxious", mins: 20, need: [30, 50], minFlow: 4, bm: { c: -12, text: "Behaviour management alone is unlikely to be enough for this anxious child." } },
      { name: "Adult, mild dental anxiety", mins: 25, need: [20, 40], minFlow: 5, bm: { c: 0, text: "Behaviour management and clear communication worked for this patient." } },
      { name: "Adult, strong gag reflex", mins: 25, need: [30, 50], minFlow: 6, bm: { c: -8, text: "Behaviour management alone did not control the gag reflex." } }
    ],
    goalText: "Cut clinical N2O emissions by at least 70% with no sedation failures.",
    goal: function (r) {
      var red = r.n2oBase ? (1 - r.f / r.n2oBase) * 100 : 0;
      return { pass: red >= 70 && r.c >= 80, metrics: [E.M("N2O emission reduction", red, 70, "min", E.pct)],
        lines: [r.sedLines || "", "Order of effect: avoid unnecessary use, titrate to the lowest effective concentration, fix leaks and scavenge, then abate what remains."] };
    }
  });

  /* ---------- LEVEL 3 ---------- */
  E.games.push({
    id: "3.1", level: 3, engine: "calendar", title: "Appointment Calendar Tetris",
    brief: "Four patients have fragmented treatment plans. Merge adjacent visits into safe block appointments, and move suitable reviews to teledentistry. Travel is the largest carbon hotspot in primary dental care (64.5% in the framework).",
    learn: ["Quadrant and block scheduling", "Safe teledentistry", "Patient-centred limits"],
    start: { c: 100, b: 60 }, ref: { b0: 60, e0: 130 }, scale: 4,
    patients: [
      { name: "Adnan (adult, periodontal)", km: 18, max: 90, visits: [
        { n: "Exam", m: 30 }, { n: "Radiographs", m: 15 }, { n: "Debridement UR/LR", m: 30 }, { n: "Debridement UL/LL", m: 30 }, { n: "Review of home care", m: 15, tele: true }] },
      { name: "Mei (child, age 7)", km: 12, max: 50, visits: [
        { n: "Exam", m: 20 }, { n: "Fissure sealants x4", m: 30 }, { n: "Fluoride varnish review", m: 15, tele: true }] },
      { name: "Hasan (crown, molar)", km: 30, max: 90, visits: [
        { n: "Preparation and temporary", m: 75 }, { n: "Fit crown (lab gap)", m: 45, gap: true }, { n: "Check call", m: 10, tele: true }] },
      { name: "Mr Lee (elderly, rural, anxious)", km: 40, max: 60, visits: [
        { n: "Exam and consent", m: 20 }, { n: "Extraction", m: 40 }, { n: "Wound check", m: 10, tele: true }, { n: "Comfort review", m: 10, tele: true }] }
    ],
    goalText: "Reduce patient travel by at least 50% without clinical harm.",
    goal: function (r) {
      var sv = r.kmBase ? (1 - r.km / r.kmBase) * 100 : 0;
      return { pass: sv >= 50 && r.c >= 80, metrics: [E.M("Travel kilometres saved", sv, 50, "min", E.pct)],
        lines: ["Baseline travel: " + Math.round(r.kmBase) + " km. Your plan: " + Math.round(r.km) + " km.", r.calLines || ""] };
    }
  });

  E.games.push({
    id: "3.2", level: 3, engine: "interview", title: "Ecosystemic Consultation Tree",
    brief: "Take a history that reaches beyond the mouth. You can ask nine of fourteen questions. Find every environmental health risk driver in this family. (Montreal-Toulouse style, patient-centred, ecosystemic history.)",
    learn: ["Environmental exposure history", "Heat and air-quality risk", "Eco-anxiety awareness"],
    start: { c: 100, b: 30 }, ref: { b0: 30, e0: 10 }, scale: 1,
    limit: 9,
    intro: "Mrs L. (34) brings her son (8) for discoloured, sensitive molars. Her father (76) lives with them. They live near a busy road in an urban area that has had recent haze and heatwave alerts.",
    qs: [
      { q: "What do you eat and drink at home, and how is it stored or packaged?", a: "Mostly tinned and plastic-wrapped food, and we heat meals in plastic containers.", driver: "edc" },
      { q: "Do you use personal-care or cleaning products with fragrance or plastic additives often?", a: "Lots, and I used many during my pregnancy.", driver: "edc" },
      { q: "How does your father cope with hot days?", a: "He gets dizzy, has a dry mouth, and takes blood pressure tablets. We have no cooling at home.", driver: "heat" },
      { q: "Has your father had enough to drink during heatwaves?", a: "He avoids drinking because he does not like going to the toilet at night.", driver: "heat" },
      { q: "How do you feel about the climate news at the moment?", a: "I cannot sleep. I worry about my son's future and I have started grinding my teeth.", driver: "eco" },
      { q: "Is your tap water safe to drink?", a: "We do not trust it, so we buy sugary bottled drinks for the children.", driver: "water" },
      { q: "How is the air at home when haze returns?", a: "My son uses an inhaler, and we cook on an open stove indoors.", driver: "air" },
      { q: "What is his favourite football team?", a: "Oh, he supports a local team. He loves it.", driver: null },
      { q: "What toothpaste brand do you buy?", a: "Whatever is on sale.", driver: null },
      { q: "Does he feel nervous about the dentist?", a: "A little, but he is fine with a gentle approach.", driver: null },
      { q: "What do you hope to be able to do after treatment?", a: "I want him to be able to eat comfortably and smile at school.", driver: null },
      { q: "How long does it take to come here?", a: "Two buses, about an hour each way.", driver: null },
      { q: "Do you have family members with dental problems?", a: "My father has few teeth left.", driver: null },
      { q: "What are your sleeping habits?", a: "I sleep late.", driver: null }
    ],
    drivers: { edc: "Possible endocrine-disrupting chemical exposure (phthalates, bisphenols) in the context of enamel defects. Evidence on causality is still emerging.", heat: "Heat vulnerability: older adult, xerostomia, antihypertensive medication, no cooling.", eco: "Eco-anxiety with bruxism and sleep disturbance.", water: "Water insecurity driving sugar-sweetened beverage use.", air: "Air quality and indoor cooking smoke with respiratory disease." },
    goalText: "Identify 100% of the five environmental health risk drivers within nine questions.",
    goal: function (r) {
      var found = r.found || 0;
      return { pass: found >= 5 && r.c >= 80, metrics: [E.M("Environmental risk drivers identified", found / 5 * 100, 100, "min", E.pct)],
        lines: ["Linking the findings: " + Object.keys(r.drv || {}).map(function (k) { return E.games.filter(function (g) { return g.id === "3.2"; })[0].drivers[k]; }).join(" ")] };
    }
  });

  E.games.push({
    id: "3.3", level: 3, engine: "scenario", title: "Chemical & Antimicrobial Stewardship Engine",
    brief: "Six cases test antibiotic stewardship and pharmaceutical disposal. Every decision must be compliant. Inappropriate prescribing drives antimicrobial resistance (AMR).",
    learn: ["Antibiotics are not an analgesic", "Source control first", "Safe disposal of expired medicines"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 10 }, scale: 30,
    goalText: "100% antimicrobial prescribing compliance.",
    steps: [
      { title: "Irreversible pulpitis", text: "Severe spontaneous pain, lingering to cold, no swelling, no fever.", opts: [
        { t: "Provide operative pulp treatment or extraction, and analgesia. No antibiotics.", good: true, d: { f: 0.5, b: -4 }, fb: "Source control is the treatment. Antibiotics add resistance risk without benefit.", ev: "Antimicrobial stewardship guidance" },
        { t: "Prescribe amoxicillin and rebook in a week.", good: false, d: { f: 1, c: -12 }, fb: "Does not treat the cause." },
        { t: "Prescribe broad-spectrum antibiotics plus metronidazole.", good: false, d: { f: 1.5, c: -15 }, fb: "Broader coverage adds harm and AMR pressure." }] },
      { title: "Localised abscess", text: "Fluctuant swelling next to a non-vital tooth. Afebrile, no trismus, no systemic signs.", opts: [
        { t: "Drain and treat the source. No routine antibiotics.", good: true, d: { f: 0.5, b: -4 }, fb: "Local measures treat localised infection.", ev: "Stewardship guidance" },
        { t: "Antibiotics alone.", good: false, d: { f: 1, c: -12 }, fb: "Without drainage this often fails." },
        { t: "Wait and see.", good: false, d: { c: -10 }, fb: "Delay can allow spread." }] },
      { title: "Spreading infection", text: "Facial swelling, temperature 38.9 °C, trismus, difficulty swallowing.", opts: [
        { t: "Urgent medical referral, systemic antibiotics, and arrange source control.", good: true, d: { f: 1, b: -6 }, fb: "Systemic spread needs urgent action. Stewardship supports antibiotics when indicated.", ev: "Stewardship guidance" },
        { t: "Advise analgesics and book next week.", good: false, d: { c: -25 }, fb: "Dangerous delay." },
        { t: "Remove the tooth in clinic without referral.", good: false, d: { c: -20 }, fb: "Airway risk requires escalation." }] },
      { title: "Request for antibiotics after a simple extraction", text: "A healthy adult asks for antibiotics 'just in case' after an uncomplicated extraction.", opts: [
        { t: "Explain why they are not needed, give aftercare advice and a safety net.", good: true, d: { f: 0.1, s: 3 }, fb: "Communication is the prescription. Empowerment reduces demand.", ev: "CSH principle 2" },
        { t: "Prescribe to keep the patient happy.", good: false, d: { f: 1, c: -10 }, fb: "Avoidable prescription." },
        { t: "Prescribe a short course because the clinic is busy.", good: false, d: { f: 1, c: -10 }, fb: "Convenience prescribing drives AMR." }] },
      { title: "Prosthetic joint patient", text: "A patient with a hip replacement asks if they need prophylaxis before scaling.", opts: [
        { t: "Routine prophylaxis is not generally recommended. Discuss, and liaise with the orthopaedic team if there are specific concerns.", good: true, d: { f: 0.1, s: 2 }, fb: "Most guidelines advise against routine prophylaxis for dental procedures in patients with joint replacements.", ev: "Joint-replacement prophylaxis guidance" },
        { t: "Prescribe prophylaxis for everyone with a prosthesis.", good: false, d: { f: 1, c: -8 }, fb: "Over-prescribing without evidence." },
        { t: "Refuse care.", good: false, d: { c: -10, s: -4 }, fb: "Unnecessary refusal harms access." }] },
      { title: "Emergency drug cabinet audit", text: "The emergency cabinet holds expired amoxicillin capsules and expired anaesthetic cartridges.", opts: [
        { t: "Return to a licensed pharmaceutical waste route via the pharmacy or waste contractor.", good: true, d: { f: 0.3, b: -2 }, fb: "Medicines in water or soil harm ecosystems and drive resistance in the environment.", ev: "Pharmaceutical waste regulations" },
        { t: "Flush the capsules and put cartridges in recycling.", good: false, d: { f: 3, c: -6 }, fb: "Pharmaceuticals do not belong in drains or recycling." },
        { t: "Keep them in case of emergency.", good: false, d: { c: -10 }, fb: "Expired stock is unsafe." }] }
    ],
    goal: function (r) {
      return { pass: r.good >= 6 && r.c >= 80, metrics: [E.M("Compliant decisions", r.good / 6 * 100, 100, "min", E.pct)],
        lines: ["Stewardship is a clinical and environmental duty: antibiotics are not a substitute for source control."] };
    }
  });
})(window.ECO);
