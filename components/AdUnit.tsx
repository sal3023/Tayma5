
import React, { useEffect } from 'react';

interface AdUnitProps {
  type: 'leaderboard' | 'rectangle' | 'in-article';
  slot?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type, slot }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  const styles = {
    leaderboard: 'w-full h-24 md:h-32 mb-8',
    rectangle: 'w-full h-64 mb-8',
    'in-article': 'w-full h-auto my-12 py-4 border-y border-slate-50'
  };

  const PUBLISHER_ID = 'ca-pub-9209979470286545';

  return (
    <div className={`adsense-container ${styles[type]} overflow-hidden`}>
      {/* AdSense Unit Code with your specific Publisher ID */}
      <ins className="adsbygoogle"
           style={{ display: 'block', textAlign: 'center' }}
           data-ad-client={PUBLISHER_ID}
           data-ad-layout={type === 'in-article' ? 'in-article' : undefined}
           data-ad-format="auto"
           data-ad-slot={slot || 'default_slot_id'}
           data-full-width-responsive="true"></ins>
      
      {/* Visual Placeholder for development */}
      <div className="adsense-placeholder">
        إعلان AdSense مستهدف ({type})
      </div>
    </div>
  );
};

export default AdUnit;
