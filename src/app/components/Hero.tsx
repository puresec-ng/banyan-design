import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 bg-[#1B4332]"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 sm:mb-8 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            <span className="text-green-300 block mt-2 break-words">
              Claims Advisory and Support, Made Clear
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
            We help individuals, businesses and organisations prepare claim information, organise documents, track next steps and strengthen claims capability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center">
            <Link
              href="/request-support"
              className="bg-[#E67635] hover:bg-[#d16426] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 sm:min-w-[200px] rounded-2xl transition-colors text-center"
            >
              Request Support
            </Link>
            <Link
              href="/training-research"
              className="bg-white hover:bg-gray-100 text-[#1B4332] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 sm:min-w-[200px] rounded-2xl transition-colors text-center"
            >
              Training &amp; Advisory
            </Link>
          </div>
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-base text-gray-200 max-w-2xl mx-auto text-pretty leading-relaxed">
            <span className="font-semibold text-white">Important Notice:</span> Advisory and support only. We do not sell insurance, act as brokers, adjust losses or decide claims.
          </p>
        </div>
      </div>
    </section>
  );
}
