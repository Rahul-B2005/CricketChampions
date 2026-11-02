// Commentary lines in English (en), Tamil (ta) and Hindi (hi).
// Placeholders: {b} batter, {w} bowler, {t} batting team, {o} bowling team, {a}/{c} fixture teams,
// {venue} {fmt} {runs} {wkts} {target}
export const LANGS = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ta', label: 'தமிழ்', short: 'தமிழ்' },
  { id: 'hi', label: 'हिन्दी', short: 'हिन्दी' },
];

const C = {
  en: {
    welcome: ['Good evening everyone, and welcome to {venue}! {a} take on {c} in this {fmt} international. What an atmosphere inside the stadium!'],
    tossFlip: ['The coin is in the air...', 'Here we go — the coin goes up!'],
    tossBat: ['{t} win the toss and will bat first.', '{t} have won the toss and elected to bat.'],
    tossBowl: ['{t} win the toss and will bowl first.', '{t} have won the toss and elected to field first.'],
    anthem: ['The teams line up as the whole stadium rises for the national anthems.'],
    inningsStart: ['{t} are ready to begin their innings. {w} charges in to bowl the first ball.'],
    dot: ['{w} keeps it tight — no run, dot ball.', 'Good bowling from {w}. Nothing off that one.', '{b} cannot get it away. Dot ball.'],
    miss: ['{b} swings and misses! Beaten completely.', 'Too quick for {b}! Beaten all ends up.'],
    one: ['{b} works it into the gap for a single.', 'Just one run there.'],
    two: ['Good running — they come back for two!', '{b} pushes it into the gap, and it is two runs.'],
    four: ['FOUR! Beautifully timed by {b}, racing away to the rope!', 'What a shot! That is a boundary!', 'Cracked away by {b}, no chance for the fielder. Four!'],
    six: ['SIX! {b} sends it into the stands! Massive!', 'That is out of here! What a hit from {b}!', 'Maximum! The crowd goes wild!'],
    wicket: ['OUT! {b} has to go — and {w} gets the wicket!', 'Taken! A big moment in the match!', 'Gone! {w} strikes!'],
    overEnd: ['End of the over. {t} are {runs} for {wkts}.'],
    inningsEnd: ['That is the end of the first innings. {t} finish on {runs} for {wkts}. {o} need {target} to win.'],
    win: ['And that is the match! {t} win it! What a game of cricket!'],
    tie: ['It is a tie! Unbelievable scenes!'],
  },
  ta: {
    welcome: ['அனைவருக்கும் வணக்கம்! {venue} மைதானத்தில் {a} மற்றும் {c} அணிகள் மோதும் {fmt} சர்வதேசப் போட்டிக்கு உங்களை வரவேற்கிறோம். மைதானமே ஆரவாரத்தில் அதிர்கிறது!'],
    tossFlip: ['நாணயம் சுழல்கிறது... வானில் உயர்கிறது!', 'இதோ, நாணயம் மேலே எழும்புகிறது!'],
    tossBat: ['{t} அணி டாஸ் வென்று, முதலில் பேட்டிங் செய்யத் தீர்மானித்துள்ளது.'],
    tossBowl: ['{t} அணி டாஸ் வென்று, முதலில் பந்துவீசத் தீர்மானித்துள்ளது.'],
    anthem: ['இரு அணிகளும் தேசிய கீதத்திற்காக அணிவகுத்து நிற்கின்றன. மைதானமே எழுந்து நிற்கிறது.'],
    inningsStart: ['{t} அணியின் பேட்டிங் தொடங்குகிறது. {w} முதல் பந்தை வீசத் தயாராகிறார்.'],
    dot: ['{w} இறுக்கமாக வீசுகிறார். ரன் இல்லை, டாட் பால்.', 'அருமையான பந்துவீச்சு! அந்தப் பந்தில் ரன் எதுவும் இல்லை.', '{b} பந்தை நகர்த்த முடியவில்லை. டாட் பால்.'],
    miss: ['{b} அடிக்க முயன்று தவறவிட்டார்! பந்து அவரைக் கடந்து சென்றது.', 'வேகமான பந்து! {b} முற்றிலும் தவறவிட்டார்.'],
    one: ['{b} இடைவெளியில் தள்ளி ஒரு ரன் எடுக்கிறார்.', 'ஒரே ஒரு ரன் மட்டும்.'],
    two: ['நன்றாக ஓடினார்கள், இரண்டு ரன்கள்!', '{b} பந்தை இடைவெளியில் அனுப்பி இரண்டு ரன்கள் எடுக்கிறார்.'],
    four: ['பவுண்டரி! அற்புதமான டைமிங், {b}!', 'என்ன ஒரு ஷாட்! பந்து எல்லைக்கோட்டை நோக்கிப் பாய்கிறது! நான்கு ரன்கள்!', '{b} அடித்த பந்தை எந்த பீல்டராலும் தடுக்க முடியவில்லை. நான்கு!'],
    six: ['சிக்ஸர்! {b} பந்தை ரசிகர்களிடம் அனுப்புகிறார்!', 'மைதானத்தையே தாண்டிவிட்டது! என்ன ஒரு அடி, {b}!', 'ஆறு ரன்கள்! ரசிகர்கள் ஆரவாரம் செய்கிறார்கள்!'],
    wicket: ['அவுட்! {b} வெளியேறுகிறார், {w} விக்கெட் எடுத்தார்!', 'கேட்ச்! போட்டியின் முக்கியமான தருணம்!', 'விக்கெட்! {w} தாக்குகிறார்!'],
    overEnd: ['ஓவர் முடிந்தது. {t} அணி {runs} ரன்கள், {wkts} விக்கெட் இழப்புக்கு.'],
    inningsEnd: ['முதல் இன்னிங்ஸ் முடிந்தது. {t} அணி {runs} ரன்கள் எடுத்துள்ளது. {o} அணிக்கு வெற்றி இலக்கு {target}.'],
    win: ['ஆட்டம் முடிந்தது! {t} அணி வெற்றி பெற்றது! என்ன ஒரு அருமையான போட்டி!'],
    tie: ['ஆட்டம் சமனில் முடிந்தது! நம்பவே முடியவில்லை!'],
  },
  hi: {
    welcome: ['सभी दर्शकों को नमस्कार! {venue} में {a} और {c} के बीच {fmt} अंतरराष्ट्रीय मुक़ाबले में आपका स्वागत है। स्टेडियम में गज़ब का माहौल है!'],
    tossFlip: ['सिक्का उछल चुका है... हवा में घूम रहा है!', 'लीजिए, सिक्का ऊपर जा रहा है!'],
    tossBat: ['{t} ने टॉस जीता है और पहले बल्लेबाज़ी करने का फ़ैसला किया है।'],
    tossBowl: ['{t} ने टॉस जीता है और पहले गेंदबाज़ी चुनी है।'],
    anthem: ['दोनों टीमें राष्ट्रगान के लिए कतार में खड़ी हैं। पूरा स्टेडियम खड़ा हो गया है।'],
    inningsStart: ['{t} की बल्लेबाज़ी शुरू होती है। {w} पहली गेंद के लिए तैयार हैं।'],
    dot: ['{w} कसी हुई गेंदबाज़ी कर रहे हैं। कोई रन नहीं, डॉट बॉल।', 'शानदार गेंद! उस पर कोई रन नहीं मिला।', '{b} गेंद को निकाल नहीं पाए। डॉट बॉल।'],
    miss: ['{b} ने शॉट खेला लेकिन चूक गए! गेंद बगल से निकल गई।', 'तेज़ गेंद! {b} पूरी तरह बीट हो गए।'],
    one: ['{b} ने गैप में खेलकर एक रन लिया।', 'सिर्फ़ एक रन।'],
    two: ['बढ़िया दौड़, दो रन!', '{b} ने गैप में खेला और दो रन ले लिए।'],
    four: ['चौका! क्या टाइमिंग है, {b}!', 'क्या शॉट है! गेंद सीमा रेखा की ओर दौड़ पड़ी! चार रन!', '{b} के शॉट को कोई फ़ील्डर रोक नहीं सका। चौका!'],
    six: ['छक्का! {b} ने गेंद दर्शकों में पहुँचा दी!', 'गेंद स्टेडियम के बाहर! क्या ग़ज़ब का शॉट, {b}!', 'छह रन! दर्शक झूम उठे!'],
    wicket: ['आउट! {b} पवेलियन लौट रहे हैं, {w} को मिला विकेट!', 'कैच! मैच का बड़ा मोड़!', 'विकेट! {w} ने किया वार!'],
    overEnd: ['ओवर समाप्त। {t} का स्कोर {runs} रन, {wkts} विकेट पर।'],
    inningsEnd: ['पहली पारी समाप्त। {t} ने {runs} रन बनाए। {o} को जीत के लिए {target} रन चाहिए।'],
    win: ['मैच ख़त्म! {t} ने जीत हासिल की! क्या शानदार मुक़ाबला!'],
    tie: ['मैच टाई हुआ! यक़ीन नहीं होता!'],
  },
};

const lastIdx = {};
export function commentaryLine(lang, event, vars = {}) {
  const pool = (C[lang] || C.en)[event];
  if (!pool?.length) return '';
  const key = `${lang}:${event}`;
  let i = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && i === lastIdx[key]) i = (i + 1) % pool.length;
  lastIdx[key] = i;
  return pool[i].replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
}
