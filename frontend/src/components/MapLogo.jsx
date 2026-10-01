import React from 'react';
import ancient from '../assets/ancient.webp';
import anubis from '../assets/anubis.webp';
import cache from '../assets/cache.webp';
import dust2 from '../assets/dust2.webp';
import inferno from '../assets/inferno.webp';
import mirage from '../assets/mirage.webp';
import nuke from '../assets/nuke.webp';

export default function MapLogo({ mapName, style, showName = true }) {
  if (!mapName) return null;
  
  const getLogo = () => {
    const name = mapName.toLowerCase();
    if (name.includes('ancient')) return ancient;
    if (name.includes('anubis')) return anubis;
    if (name.includes('cache')) return cache;
    if (name.includes('dust2')) return dust2;
    if (name.includes('inferno')) return inferno;
    if (name.includes('mirage')) return mirage;
    if (name.includes('nuke')) return nuke;
    return null;
  };

  const logoSrc = getLogo();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...style }}>
      {logoSrc && (
        <img 
          src={logoSrc} 
          alt={`Logo de ${mapName}`} 
          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
        />
      )}
      {showName && <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>{mapName}</span>}
    </div>
  );
}
