import { useEffect, useState } from 'react';
import { FiMic, FiMicOff, FiUsers } from 'react-icons/fi';
import { LANGS } from '../game/commentary';
import { Speech } from '../game/audio';

export default function AudioBar({ lang, setLang, voiceOn, setVoiceOn, crowdOn, setCrowdOn }) {
  const [hasVoice, setHasVoice] = useState(true);
  useEffect(() => {
    if (!Speech.supported()) { setHasVoice(false); return; }
    const check = () => setHasVoice(!!Speech.voice(lang));
    check();
    window.speechSynthesis.addEventListener?.('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', check);
  }, [lang]);
  return (
    <div className="audio-bar">
      <div className="lang-switch" role="group" aria-label="Commentary language">
        {LANGS.map((l) => (
          <button key={l.id} className={lang === l.id ? 'active' : ''} onClick={() => setLang(l.id)} title={l.label}>{l.short}</button>
        ))}
      </div>
      <button className={`ab-toggle ${voiceOn ? 'on' : ''}`} onClick={() => setVoiceOn(!voiceOn)}>
        {voiceOn ? <FiMic /> : <FiMicOff />} Commentary voice
      </button>
      <button className={`ab-toggle ${crowdOn ? 'on' : ''}`} onClick={() => setCrowdOn(!crowdOn)}>
        <FiUsers /> Crowd {crowdOn ? 'on' : 'off'}
      </button>
      {voiceOn && !hasVoice && <span className="ab-note">No {LANGS.find((l) => l.id === lang)?.label} voice found on this device — showing subtitles only.</span>}
    </div>
  );
}
