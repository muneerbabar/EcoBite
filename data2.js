/* EcoBite content, part 2: Levels 4 and 5. Scenario quantities are simplified teaching parameters. */
(function (E) {
  var M = E.M, P = E.pct;
  /* ---------- LEVEL 4 ---------- */
  E.games.push({
    id: "4.1", level: 4, engine: "allocate", title: "Full-Hospital SusQI Audit Engine",
    brief: "You run a 50-chair dental teaching hospital with an illustrative baseline of 1,200 t CO2e per year. Choose interventions within the budget. Savings from avoided incineration and energy can be reinvested in a virtual haptic simulation suite. Offsets do not count as a net reduction.",
    learn: ["SusQI audit cycle", "Scope 1 to 3 hotspots", "Reinvesting savings"],
    start: { c: 100, b: 80 }, ref: { b0: 80, e0: 1200 }, scale: 1, unit: "t CO2e", kgPerUnit: 1000, base: 1200,
    goalText: "Achieve at least 20% net facility carbon reduction, fund the haptic suite from savings, stay within budget.",
    items: [
      { id: "tr", grp: "Waste", name: "Segregation training and bin audits", desc: "Cuts SW404 over-use; saves incineration costs.", cost: 10, co2: 3, save: 8 },
      { id: "po", grp: "Waste", name: "Pouch paper diversion programme", desc: "Peel and recycle unsoiled sterile pouch paper.", cost: 6, co2: 1.5, save: 5 },
      { id: "su", grp: "Materials", name: "Single-use plastic swap programme", desc: "Reusable mirrors, probes, cups where safe.", cost: 14, co2: 4, save: 6 },
      { id: "pr", grp: "Materials", name: "Procurement policy: Buy Less, Buy Better", desc: "Right-size orders, durable and repairable items.", cost: 5, co2: 3, save: 10 },
      { id: "sp", grp: "Materials", name: "Amalgam separator compliance audit (ISO 11143)", desc: "Protects wastewater, supports Minamata compliance.", cost: 8, co2: 0.5, save: 0 },
      { id: "te", grp: "Travel", name: "Teledentistry and block scheduling", desc: "Targets the biggest hotspot: patient and staff travel.", cost: 12, co2: 10, save: 4 },
      { id: "dg", grp: "Travel", name: "Digital radiography and records", desc: "Less chemistry, paper and courier.", cost: 15, co2: 2, save: 3 },
      { id: "n2", grp: "Energy and gases", name: "Nitrous oxide leak audit and abatement", desc: "Fix leaks, add catalytic cracking.", cost: 18, co2: 4, save: 0 },
      { id: "en", grp: "Energy and gases", name: "LED lighting and smart HVAC scheduling", desc: "Runs clinics only when occupied.", cost: 20, co2: 6, save: 14 },
      { id: "gt", grp: "Energy and gases", name: "Renewable electricity contract", desc: "Large Scope 2 cut, no cash savings.", cost: 30, co2: 9, save: 0 },
      { id: "of", grp: "Traps", name: "Buy carbon offsets only", desc: "Reports an 8% claim, but nothing changes in the clinic.", cost: 25, co2: 8, save: 0, offset: true },
      { id: "ru", grp: "Traps", name: "Reuse single-use endodontic files without validated reprocessing", desc: "Cheap and fast.", cost: 0, co2: 1, save: 3, c: -30 },
      { id: "hp", grp: "Reinvestment", name: "Virtual haptic simulation suite", desc: "Funded only from savings. Reduces consumables in pre-clinical training.", cost: 22, co2: 2, save: 0, reinvest: true, s: 12 }
    ],
    goal: function (r) {
      return { pass: r.pct >= 20 && r.haptic && r.over <= 0 && r.c >= 80,
        metrics: [M("Net facility carbon reduction", r.pct, 20, "min", P), { label: "Savings reinvested in haptic suite", value: r.haptic ? "Yes" : "No", target: "Yes", ok: !!r.haptic, att: r.haptic ? 1 : 0 }],
        lines: ["Net reduction counted: " + (Math.round(r.pct * 10) / 10) + "% (" + Math.round(r.base * r.pct / 100) + " t CO2e). Annual savings pool: " + r.pool + " credits.",
          r.offsetNote || "", "Audit, act, re-audit: SusQI works as a repeating cycle, not a one-off project."] };
    }
  });

  E.games.push({
    id: "4.2", level: 4, engine: "doughnut", title: "Doughnut Economics Clinic Manager",
    brief: "Keep the clinic in the safe and just space: every social foundation at or above 60 and every ecological pressure at or below 60. Buy less, buy better. Your budget is limited, so some trade-offs are unavoidable.",
    learn: ["Doughnut Economics", "Ethical procurement", "Social foundation vs ecological ceiling"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 100 }, scale: 1, min: 60, max: 60,
    dimsS: [{ id: "acc", n: "Access to care", v: 55 }, { id: "qua", n: "Quality and safety", v: 60 }, { id: "wor", n: "Workforce wellbeing", v: 60 }, { id: "equ", n: "Equity", v: 50 }],
    dimsE: [{ id: "car", n: "Carbon", v: 72 }, { id: "was", n: "Waste", v: 75 }, { id: "che", n: "Chemical pollution", v: 65 }, { id: "wat", n: "Water", v: 60 }],
    decisions: [
      { t: "Consumables procurement", o: [
        { t: "Bulk-buy cheapest single-use items and stockpile", cost: 10, d: [0, 0, 0, 0, 4, 8, 3, 0] },
        { t: "Right-size orders, ethical suppliers (Buy Less, Buy Better)", cost: 12, d: [0, 2, 0, 2, -6, -10, -4, 0] },
        { t: "Validated reusable gowns and drapes where appropriate", cost: 18, d: [0, 1, -2, 0, -3, -12, 0, 4] }] },
      { t: "Instruments and handpieces", o: [
        { t: "Disposable convenience instruments", cost: 14, d: [0, -2, 2, 0, 3, 9, 2, 0] },
        { t: "Durable, repairable instruments with a service contract", cost: 18, d: [0, 3, 0, 0, -4, -6, 0, 0] },
        { t: "Cheapest imports with short life", cost: 8, d: [0, -3, -2, 0, 2, 5, 2, 0] }] },
      { t: "Reaching under-served communities", o: [
        { t: "No outreach this year", cost: 0, d: [0, 0, 0, 0, 0, 0, 0, 0] },
        { t: "Mobile prevention, ART and SDF outreach with efficient logistics", cost: 20, d: [10, 3, 2, 10, 2, -1, -1, 0] },
        { t: "Diesel van outreach fleet", cost: 16, d: [10, 2, 0, 8, 8, 0, 0, 0] }] },
      { t: "Clinic energy", o: [
        { t: "Keep current arrangements", cost: 0, d: [0, 0, 0, 0, 0, 0, 0, 0] },
        { t: "LED lighting and smart HVAC schedule", cost: 10, d: [0, 0, 2, 0, -6, 0, 0, 0] },
        { t: "Green tariff and rooftop solar", cost: 30, d: [0, 0, 1, 0, -10, 0, 0, 0] }] },
      { t: "Cleaning and disinfection", o: [
        { t: "Harsh broad-spectrum products everywhere", cost: 8, d: [0, -1, -3, 0, 0, 0, 8, 3] },
        { t: "Risk-based, validated and eco-labelled products", cost: 10, d: [0, 2, 2, 0, 0, -2, -8, -2] },
        { t: "Skip surface disinfection to cut chemicals", cost: 2, d: [0, -14, 0, 0, 0, 0, -8, 0] }] },
      { t: "Workforce and scheduling", o: [
        { t: "Extend hours to cut the waiting list", cost: 10, d: [4, -3, -8, 0, 2, 0, 0, 0] },
        { t: "Block scheduling and protected breaks", cost: 6, d: [3, 2, 6, 2, -3, 0, 0, 0] },
        { t: "Use agency locums as needed", cost: 12, d: [3, -1, -3, 0, 2, 0, 0, 0] }] },
      { t: "Water and suction", o: [
        { t: "No change", cost: 0, d: [0, 0, 0, 0, 0, 0, 0, 0] },
        { t: "Dental unit waterline management, dry vacuum, rainwater for flushing", cost: 8, d: [0, 2, 0, 0, -1, 0, -2, -8] },
        { t: "Switch to bottled water supply", cost: 6, d: [0, 0, 0, 0, 3, 10, 0, -2] }] }
    ],
    goalText: "All four social dimensions at 60 or higher and all four ecological pressures at 60 or lower.",
    goal: function (r) {
      var okS = r.dimsS.filter(function (d) { return d.v >= 60; }).length, okE = r.dimsE.filter(function (d) { return d.v <= 60; }).length;
      return { pass: okS === 4 && okE === 4 && r.over <= 0 && r.c >= 80,
        metrics: [M("Social foundation met", okS, 4, "min", function (x) { return Math.round(x) + " / 4"; }), M("Ecological ceilings respected", okE, 4, "min", function (x) { return Math.round(x) + " / 4"; })],
        lines: ["Ring logic: stay out of the shortfall in the centre and inside the ecological ceiling at the edge, in the green annulus.", r.unsafeNote || ""] };
    }
  });

  E.games.push({
    id: "4.3", level: 4, engine: "allocate", title: "PHRC & MY PLANET Policy Simulator",
    brief: "Audit your institution across the five domains of the Planetary Health Report Card: curriculum, research, community outreach and advocacy, support for student-led initiatives, and campus sustainability. You have 80 effort points. A Grade A needs strong overall points and at least half of every domain.",
    learn: ["PHRC five domains", "MY PLANET benchmarking", "Advocacy to national dental councils"],
    start: { c: 100, b: 80 }, ref: { b0: 80, e0: 10 }, scale: 1, noMoney: true, unit: "effort", kgPerUnit: 0,
    goalText: "Elevate the institutional PHRC rating to Grade A.",
    items: [
      { id: "mp", grp: "Curriculum", name: "Run the MY PLANET survey to baseline coverage", desc: "108-point benchmarking tool; shows gaps by programme.", cost: 5, pts: 4 },
      { id: "lo", grp: "Curriculum", name: "Embed planetary health outcomes across all years", desc: "Integrated, not a single lecture.", cost: 10, pts: 8 },
      { id: "as", grp: "Curriculum", name: "Assess carbon literacy, waste and systems thinking in OSCEs", desc: "Assessed competencies get attention.", cost: 8, pts: 5 },
      { id: "le", grp: "Curriculum", name: "Add one optional lecture", desc: "Low effort, low reach.", cost: 2, pts: 1 },
      { id: "rg", grp: "Research", name: "Interdisciplinary planetary health research group", desc: "Dentistry with public health, engineering and ecology.", cost: 8, pts: 6 },
      { id: "sr", grp: "Research", name: "Fund student research on clinic footprint", desc: "Local data for local decisions.", cost: 6, pts: 5 },
      { id: "pu", grp: "Research", name: "Publish the audit openly", desc: "Transparency helps peers.", cost: 4, pts: 3 },
      { id: "co", grp: "Research", name: "Collaborate with a regional university", desc: "Shared methods and cohorts.", cost: 5, pts: 4 },
      { id: "cp", grp: "Community and advocacy", name: "Partner with communities on climate-health outreach", desc: "Co-designed, not extractive.", cost: 8, pts: 6 },
      { id: "pt", grp: "Community and advocacy", name: "Petition the national dental council for curriculum reform", desc: "Requires at least 9 curriculum points to be credible.", cost: 8, pts: 6, needs: { grp: "Curriculum", pts: 9 } },
      { id: "ca", grp: "Community and advocacy", name: "Public campaign on prevention and free sugars", desc: "Prevention is low-carbon care.", cost: 5, pts: 4 },
      { id: "nw", grp: "Community and advocacy", name: "Join a regional sustainable dentistry network", desc: "Easy win, modest impact.", cost: 3, pts: 2 },
      { id: "ss", grp: "Student-led initiatives", name: "Fund a student planetary health society with mentors", desc: "Students lead, staff support.", cost: 6, pts: 5 },
      { id: "gt", grp: "Student-led initiatives", name: "Green teams in every clinic", desc: "Peer-to-peer waste and SUP audits.", cost: 5, pts: 4 },
      { id: "se", grp: "Student-led initiatives", name: "Student seats on the sustainability committee", desc: "Real decision rights.", cost: 3, pts: 3 },
      { id: "aw", grp: "Student-led initiatives", name: "Annual sustainability awards", desc: "Recognition without structure.", cost: 2, pts: 1 },
      { id: "cb", grp: "Campus sustainability", name: "Institutional carbon baseline and targets", desc: "Scopes 1 to 3.", cost: 8, pts: 6 },
      { id: "wd", grp: "Campus sustainability", name: "Waste segregation and diversion programme", desc: "From Orbit 1 practice to policy.", cost: 6, pts: 5 },
      { id: "pp", grp: "Campus sustainability", name: "Sustainable procurement policy", desc: "Buy Less, Buy Better.", cost: 6, pts: 5 },
      { id: "re", grp: "Campus sustainability", name: "Renewable energy contract", desc: "Large impact, high effort.", cost: 10, pts: 4 }
    ],
    goal: function (r) {
      return { pass: r.grade === "A" && r.c >= 80,
        metrics: [{ label: "Institutional PHRC grade", value: r.grade, target: "A", ok: r.grade === "A", att: { A: 1, B: .75, C: .5, D: .25 }[r.grade] }, M("Overall points", r.pctPts, 70, "min", P)],
        lines: [r.domLines || "", "Grades are a game rule: A needs at least 70% of available points and at least half of every domain."] };
    }
  });

  /* ---------- LEVEL 5 ---------- */
  E.games.push({
    id: "5.1", level: 5, engine: "scenario", title: "Global Amalgam Treaty Negotiator",
    brief: "You chair a working group at a Minamata Convention COP. The game's target date for dental amalgam phase-out is 2034. Build a roadmap that every bloc will ratify: all six need to reach at least 60 in support.",
    learn: ["Multilateral negotiation", "ART and glass-ionomer scale-up in LMICs", "Exemptions and financing"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 10 }, scale: 1,
    stake: [{ id: "eu", n: "EU and like-minded" }, { id: "af", n: "African Group" }, { id: "ap", n: "Asia-Pacific" }, { id: "gr", n: "Latin America and Caribbean" }, { id: "si", n: "Small Island States" }, { id: "in", n: "Dental industry bodies" }],
    stakeMin: 60,
    goalText: "Reach 100% ratification: every bloc at 60 or higher.",
    steps: [
      { title: "Round 1: the date", text: "Set the phase-out date.", opts: [
        { t: "Firm 2034 target with a mid-term review.", good: true, d: { sh: { eu: 5, af: 1, ap: 2, gr: 2, si: 5, in: 2 } }, fb: "A clear date with review gives industry time to adapt.", ev: "Framework target: 2034" },
        { t: "A 2030 hard ban.", good: false, d: { c: -6, f: 2, sh: { eu: 8, af: -8, ap: -5, gr: -4, si: 3, in: -10 } }, fb: "Too fast for LMICs with no alternative capacity." },
        { t: "No date, voluntary phase-down.", good: false, d: { f: 4, sh: { eu: -6, af: 3, ap: 2, gr: 3, si: -6, in: 6 } }, fb: "Weak signal; mercury continues." }] },
      { title: "Round 2: financing", text: "How will ART and glass-ionomer scale-up be funded?", opts: [
        { t: "Global fund plus technology transfer.", good: true, d: { b: -10, sh: { eu: 1, af: 8, ap: 5, gr: 6, si: 6, in: 3 } }, fb: "Financing converts a mandate into capacity.", ev: "Prevention-first, ART in LMICs" },
        { t: "Loans only.", good: false, d: { b: -4, sh: { eu: 2, af: -4, ap: -2, gr: -2, si: -3, in: 2 } }, fb: "Debt-financed health transitions rarely build trust." },
        { t: "No new funding.", good: false, d: { f: 3, sh: { eu: 3, af: -8, ap: -5, gr: -6, si: -5, in: 3 } }, fb: "A mandate without means." }] },
      { title: "Round 3: interim safeguards", text: "What applies before the phase-out date?", opts: [
        { t: "Encapsulated only, separators required, with exemption review.", good: true, d: { sh: { eu: 4, af: 1, ap: 1, gr: 2, si: 4, in: 2 } }, fb: "Immediate harm reduction while the transition is built.", ev: "Minamata Annex A Part II" },
        { t: "Allow bulk mercury until 2034.", good: false, d: { f: 4, sh: { eu: -6, af: 2, ap: 1, gr: 1, si: -6, in: 4 } }, fb: "Bulk mercury is the most avoidable exposure." },
        { t: "Ban all use immediately.", good: false, d: { c: -10, sh: { eu: 4, af: -6, ap: -4, gr: -4, si: 2, in: -4 } }, fb: "Creates unmanaged gaps in care." }] },
      { title: "Round 4: exemptions", text: "How will clinical exemptions work?", opts: [
        { t: "Narrow, time-limited, evidence-based, with annual reporting.", good: true, d: { sh: { eu: 3, af: 2, ap: 2, gr: 2, si: 3, in: 2 } }, fb: "Balances patient needs and integrity." },
        { t: "Broad open exemptions.", good: false, d: { f: 3, sh: { eu: -5, af: 3, ap: 2, gr: 2, si: -4, in: 5 } }, fb: "An exemption that swallows the rule." },
        { t: "No exemptions at all.", good: false, d: { c: -8, sh: { eu: 3, af: -5, ap: -3, gr: -3, si: 1, in: -3 } }, fb: "Leaves rare clinical cases unprovided for." }] },
      { title: "Round 5: prevention and workforce", text: "What will drive demand for amalgam down?", opts: [
        { t: "Prevention-first training in MID and ART, fluoride access, support for SSB policy.", good: true, d: { b: -8, sh: { eu: 2, af: 6, ap: 4, gr: 5, si: 5, in: 2 } }, fb: "The best restoration is the one you do not need.", ev: "WHO Global Oral Health Action Plan" },
        { t: "Industry-sponsored training only.", good: false, d: { sh: { eu: -2, af: 1, ap: 1, gr: 1, si: -1, in: 6 } }, fb: "Independence matters." },
        { t: "Leave workforce to national budgets.", good: false, d: { sh: { eu: 0, af: -5, ap: -3, gr: -4, si: -3, in: 1 } }, fb: "Under-resourced reform stalls." }] },
      { title: "Round 6: monitoring", text: "How will progress be tracked?", opts: [
        { t: "Shared reporting on imports, use and wastewater, with capacity support.", good: true, d: { b: -4, sh: { eu: 3, af: 2, ap: 2, gr: 2, si: 3, in: 1 } }, fb: "Data creates accountability and trust." },
        { t: "Manufacturer self-reporting.", good: false, d: { sh: { eu: -3, af: 0, ap: 0, gr: 0, si: -2, in: 4 } }, fb: "Self-report alone is weak." },
        { t: "No monitoring.", good: false, d: { f: 2, sh: { eu: -5, af: -2, ap: -1, gr: -1, si: -4, in: 2 } }, fb: "Cannot manage what is not measured." }] }
    ],
    goal: function (r) {
      var ids = ["eu", "af", "ap", "gr", "si", "in"], n = ids.filter(function (k) { return (r.sh[k] || 0) >= 10; }).length;
      return { pass: n === 6 && r.c >= 80, metrics: [M("Blocs ratifying", n / 6 * 100, 100, "min", P)],
        lines: ["Treaty outcomes need both a firm date and the means to meet it."] };
    }
  });

  E.games.push({
    id: "5.2", level: 5, engine: "scenario", title: "Scope 3 Industrial Decarbonisation Engine",
    brief: "Supply chains carry the largest share of dental emissions (71% Scope 3 in the framework). Negotiate with manufacturers and distributors to abate at least 50% of manufacturer Scope 3 emissions while keeping every partner at the table (support 45 or higher).",
    learn: ["Scope 3", "Circular design", "Phasing out EDCs and phthalates"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 10 }, scale: 1,
    stake: [{ id: "ins", n: "Instrument makers" }, { id: "con", n: "Consumables and plastics" }, { id: "eq", n: "Equipment makers" }, { id: "dis", n: "Distributors" }, { id: "coa", n: "Buyers' coalition" }],
    stakeMin: 45,
    metrics: [{ id: "ab", label: "Manufacturer Scope 3 abated", unit: "%", target: 50 }],
    goalText: "Abate at least 50% of manufacturer Scope 3 emissions with every partner still supportive.",
    steps: [
      { title: "Materials redesign", text: "Single-use plastic items are the volume driver.", opts: [
        { t: "Redesign items in bio-based and circular materials with take-back.", good: true, d: { m: { ab: 16 }, sh: { ins: 2, con: -2, eq: 0, dis: 0, coa: 5 } }, fb: "Real redesign cuts emissions at source.", ev: "Circular economy" },
        { t: "Voluntary pledge with no specification.", good: false, d: { m: { ab: 3 }, sh: { ins: 0, con: 4, eq: 0, dis: 0, coa: -4 } }, fb: "Pledges without specs deliver little." },
        { t: "Buy offsets and keep the product unchanged.", good: false, d: { m: { ab: 0 }, f: 3, sh: { ins: 1, con: 5, eq: 1, dis: 1, coa: -6 } }, fb: "Offsets do not change the product footprint." }] },
      { title: "EDCs and phthalates", text: "Plasticisers and bisphenols in dental products.", opts: [
        { t: "Dated phase-out of phthalates and bisphenols in dental products.", good: true, d: { m: { ab: 4 }, sh: { ins: 0, con: -3, eq: 0, dis: -1, coa: 4 } }, fb: "Avoid harm to patients, staff and ecosystems.", ev: "Precautionary approach" },
        { t: "Labelling only.", good: false, d: { m: { ab: 1 }, sh: { ins: 0, con: 1, eq: 0, dis: 0, coa: -1 } }, fb: "Labels inform but do not remove the hazard." },
        { t: "Wait until the science is settled.", good: false, d: { sh: { ins: 0, con: 3, eq: 0, dis: 1, coa: -3 } }, fb: "Delay carries its own cost." }] },
      { title: "Take-back and refurbishment", text: "Instruments and equipment at end of life.", opts: [
        { t: "Industry-wide take-back and refurbishment.", good: true, d: { m: { ab: 12 }, sh: { ins: 2, con: 1, eq: -2, dis: -2, coa: 4 } }, fb: "Keeps materials in use.", ev: "Circular procurement" },
        { t: "Take-back for premium customers only.", good: false, d: { m: { ab: 5 }, sh: { ins: 1, con: 0, eq: 1, dis: 0, coa: -2 } }, fb: "Inequitable and limited." },
        { t: "No take-back.", good: false, d: { sh: { ins: 0, con: 1, eq: 1, dis: 1, coa: -3 } }, fb: "Waste stays the buyer's problem." }] },
      { title: "Freight and logistics", text: "Distribution footprints.", opts: [
        { t: "Consolidated low-carbon freight and regional hubs.", good: true, d: { m: { ab: 8 }, sh: { ins: 0, con: 1, eq: 0, dis: -2, coa: 3 } }, fb: "Fewer shipments, lower emissions.", ev: "Scope 3 logistics" },
        { t: "Express air freight as default.", good: false, d: { m: { ab: -2 }, f: 3, sh: { ins: 0, con: 1, eq: 1, dis: 3, coa: -2 } }, fb: "Convenience with a high carbon cost." },
        { t: "Keep current logistics.", good: false, d: { sh: { ins: 0, con: 0, eq: 0, dis: 1, coa: -1 } }, fb: "Misses an easy win." }] },
      { title: "Design for repair", text: "Equipment lifespan.", opts: [
        { t: "Right-to-repair and parts availability for ten years.", good: true, d: { m: { ab: 10 }, sh: { ins: 1, con: 0, eq: -3, dis: 1, coa: 5 } }, fb: "Longer life lowers embodied carbon per year of use.", ev: "Buy Less, Buy Better" },
        { t: "Two-year warranty extension.", good: false, d: { m: { ab: 4 }, sh: { ins: 0, con: 0, eq: -1, dis: 0, coa: 1 } }, fb: "Helpful but small." },
        { t: "Planned upgrade cycle.", good: false, d: { m: { ab: -3 }, sh: { ins: 1, con: 1, eq: 4, dis: 2, coa: -4 } }, fb: "Obsolescence adds embodied carbon." }] },
      { title: "Disclosure", text: "Product-level carbon information.", opts: [
        { t: "Third-party verified carbon declarations for each product.", good: true, d: { m: { ab: 6 }, sh: { ins: -1, con: 0, eq: 0, dis: 0, coa: 5 } }, fb: "Transparent data enables purchasing choices.", ev: "EPD practice" },
        { t: "Self-declared marketing claims.", good: false, d: { m: { ab: 1 }, sh: { ins: 1, con: 2, eq: 1, dis: 1, coa: -3 } }, fb: "Greenwashing risk." },
        { t: "No disclosure.", good: false, d: { sh: { ins: 1, con: 1, eq: 1, dis: 1, coa: -4 } }, fb: "Blocks informed purchasing." }] }
    ],
    goal: function (r) {
      var ab = r.m.ab || 0, ids = ["ins", "con", "eq", "dis", "coa"], keep = ids.filter(function (k) { return 50 + (r.sh[k] || 0) >= 45; }).length;
      return { pass: ab >= 50 && keep === 5 && r.c >= 80, metrics: [M("Manufacturer Scope 3 abated", ab, 50, "min", P), M("Partners still supportive", keep, 5, "min", function (x) { return Math.round(x) + " / 5"; })],
        lines: ["Scope 3 reductions come from redesign, reuse, logistics and transparency, not from offsets."] };
    }
  });

  E.games.push({
    id: "5.3", level: 5, engine: "scenario", title: "One Health & Eco-Systemic Equity Simulator",
    brief: "Design a national oral health policy portfolio aligned with the WHO Global Oral Health Action Plan 2023 to 2030. In this illustrative national model you must abate 1.5 Mt CO2e per year while keeping every stakeholder group at 45 or higher.",
    learn: ["One Health", "Sugar-sweetened beverage policy", "Equity and population prevention"],
    start: { c: 100, b: 100 }, ref: { b0: 100, e0: 10 }, scale: 1,
    stake: [{ id: "tr", n: "Treasury" }, { id: "pu", n: "Public and patients" }, { id: "wf", n: "Dental workforce" }, { id: "bv", n: "Beverage industry" }, { id: "ru", n: "Rural and remote communities" }],
    stakeMin: 45,
    metrics: [{ id: "mt", label: "National dental carbon abated", unit: "Mt CO2e/yr", target: 1.5 }],
    goalText: "Abate at least 1.5 Mt CO2e per year in the model with all stakeholders at 45 or higher.",
    steps: [
      { title: "Sugar policy", text: "Free sugars drive caries and restorative demand.", opts: [
        { t: "Health-earmarked SSB tax with reformulation incentives.", good: true, d: { m: { mt: 0.3 }, sh: { tr: 6, pu: 2, wf: 3, bv: -4, ru: 2 } }, fb: "Reduces caries demand and funds prevention.", ev: "WHO GOHAP; SSB tax evidence" },
        { t: "Voluntary reformulation pledge.", good: false, d: { m: { mt: 0.05 }, sh: { tr: -2, pu: -2, wf: 0, bv: 4, ru: 0 } }, fb: "Weak without incentives." },
        { t: "Ban sugary drinks.", good: false, d: { m: { mt: 0.2 }, c: -4, sh: { tr: -2, pu: -8, wf: 1, bv: -14, ru: -4 } }, fb: "Politically unsustainable and inequitable." }] },
      { title: "School-based prevention", text: "Reach children early.", opts: [
        { t: "Supervised brushing and fluoride varnish in schools.", good: true, d: { m: { mt: 0.3 }, b: -8, sh: { tr: -2, pu: 5, wf: 2, bv: 0, ru: 4 } }, fb: "Population prevention reduces future restorative demand.", ev: "WHO GOHAP" },
        { t: "Leaflets only.", good: false, d: { m: { mt: 0.02 }, sh: { tr: 1, pu: 0, wf: 0, bv: 0, ru: -1 } }, fb: "Low reach, low effect." },
        { t: "Targeted programme in cities only.", good: false, d: { m: { mt: 0.12 }, sh: { tr: 0, pu: 2, wf: 1, bv: 0, ru: -6 } }, fb: "Widens inequity." }] },
      { title: "Universal health coverage", text: "Where does oral health sit in the system?", opts: [
        { t: "Integrate oral health into UHC packages and NCD programmes.", good: true, d: { m: { mt: 0.35 }, b: -10, sh: { tr: -3, pu: 6, wf: 4, bv: 0, ru: 5 } }, fb: "Integration improves access and prevention.", ev: "One Health; GOHAP" },
        { t: "Leave it out of UHC.", good: false, d: { sh: { tr: 3, pu: -5, wf: -3, bv: 0, ru: -5 } }, fb: "Out-of-pocket payment deepens inequity." },
        { t: "Create a separate vertical programme.", good: false, d: { m: { mt: 0.1 }, sh: { tr: -2, pu: 1, wf: 1, bv: 0, ru: 0 } }, fb: "Fragmentation." }] },
      { title: "Workforce model", text: "Who delivers care, where?", opts: [
        { t: "Train mid-level and community providers in ART, SDF and prevention.", good: true, d: { m: { mt: 0.3 }, sh: { tr: 2, pu: 3, wf: -2, bv: 0, ru: 7 } }, fb: "Extends reach with low-carbon care. Protect scope and supervision.", ev: "GOHAP workforce" },
        { t: "Rely only on dentists.", good: false, d: { sh: { tr: -2, pu: -2, wf: 4, bv: 0, ru: -6 } }, fb: "Access gaps persist." },
        { t: "Recruit overseas dentists.", good: false, d: { m: { mt: -0.05 }, sh: { tr: -4, pu: 0, wf: 1, bv: 0, ru: -1 } }, fb: "Poaching skilled staff is an ethical issue." }] },
      { title: "Care delivery model", text: "Journeys and facilities.", opts: [
        { t: "Teledentistry and community hubs to cut travel.", good: true, d: { m: { mt: 0.35 }, sh: { tr: 2, pu: 3, wf: 0, bv: 0, ru: 4 } }, fb: "Travel is a hotspot.", ev: "Framework travel figure" },
        { t: "Centralise into a few large hospitals.", good: false, d: { m: { mt: -0.1 }, sh: { tr: 3, pu: -4, wf: 2, bv: 0, ru: -8 } }, fb: "Longer trips, lower access." },
        { t: "No change.", good: false, d: { sh: { tr: 1, pu: -1, wf: 1, bv: 0, ru: -1 } }, fb: "Misses the hotspot." }] },
      { title: "Greening supply", text: "National procurement.", opts: [
        { t: "National standards: amalgam transition, circular supplies, verified carbon data.", good: true, d: { m: { mt: 0.4 }, sh: { tr: -2, pu: 1, wf: 1, bv: 0, ru: 0 } }, fb: "Buying power moves markets.", ev: "Scope 3 leverage" },
        { t: "Cheapest bid wins.", good: false, d: { m: { mt: -0.05 }, sh: { tr: 4, pu: 0, wf: -1, bv: 0, ru: 0 } }, fb: "Hidden environmental costs." },
        { t: "Voluntary guidance.", good: false, d: { m: { mt: 0.08 }, sh: { tr: 0, pu: 0, wf: 0, bv: 0, ru: 0 } }, fb: "Modest effect." }] }
    ],
    goal: function (r) {
      var mt = r.m.mt || 0, ids = ["tr", "pu", "wf", "bv", "ru"], keep = ids.filter(function (k) { return 50 + (r.sh[k] || 0) >= 45; }).length;
      return { pass: mt >= 1.5 && keep === 5 && r.c >= 80, metrics: [M("National dental carbon abated", mt, 1.5, "min", function (x) { return (Math.round(x * 100) / 100) + " Mt"; }), M("Stakeholders on board", keep, 5, "min", function (x) { return Math.round(x) + " / 5"; })],
        lines: ["Systems change: prevention, integration, workforce, delivery and supply chain have to move together."] };
    }
  });
})(window.ECO);
