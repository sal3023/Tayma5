
import React, { useEffect } from 'react';

interface AdUnitProps {
  type: 'leaderboard' | 'rectangle' | 'in-article';
  slot: string; // جعل 'slot' مطلوبًا
}

const AdUnit: React.FC<AdUnitProps> = ({ type, slot }) => {
  const PUBLISHER_ID = 'ca-pub-9209979470286545';

  useEffect(() => {
    if (!slot || !PUBLISHER_ID) {
      console.warn('AdSense Warning: Ad slot or Publisher ID is missing. Ads will not be displayed correctly.');
      return;
    }
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense Error during push:', e);
    }
  }, [slot, PUBLISHER_ID]); // Add slot and publisher ID to dependencies

  const styles = {
    leaderboard: 'w-full h-24 md:h-32 mb-8',
    rectangle: 'w-full h-64 mb-8',
    'in-article': 'w-full h-auto my-12 py-4 border-y border-slate-50'
  };

  if (!slot || !PUBLISHER_ID) {
    return (
      <div className={`adsense-container ${styles[type]} flex items-center justify-center bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-center font-bold text-sm`}>
        <span className="text-xl mr-2">⚠️</span> AdSense Placeholder: Missing Ad Slot ID or Publisher ID
      </div>
    );
  }

  return (
    <div className={`adsense-container ${styles[type]} overflow-hidden`}>
      <ins className="adsbygoogle"
           style={{ display: 'block', textAlign: 'center' }}
           data-ad-client={PUBLISHER_ID}
           data-ad-layout={type === 'in-article' ? 'in-article' : undefined}
           data-ad-format="auto"
           data-ad-slot={slot} // استخدام slot مباشرة
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdUnit;
