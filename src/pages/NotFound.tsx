import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D00] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="font-display text-[#FF1493]/20 text-[200px] leading-none block select-none">404</span>
        <h2 className="font-display text-white text-4xl tracking-tight -mt-10 mb-4">LOST YOUR TWIST?</h2>
        <p className="text-white/40 font-editorial italic text-base mb-10">This page doesn't exist — but bold earrings do.</p>
        <Link
          to="/"
          className="inline-block bg-[#FF1493] hover:bg-[#e0127f] text-white font-body font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-200"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}
