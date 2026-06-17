import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="pt-36 pb-16 md:pt-40 md:pb-24 bg-[#1B4332]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-xl mb-8 text-white">
            <span className="text-green-300 block mt-2">Claims Documentation, Workflow Support and Advisory</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Banyan Claims Consultant Limited helps individuals, SMEs and business users prepare, organise and track insurance-related claims through structured documentation support, claims workflow support and clear communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/submit-claim"
              className="bg-[#E67635] hover:bg-[#d16426] text-white text-lg px-8 py-4 min-w-[200px] rounded-2xl transition-colors"
            >
              Start a Claim Review
            </Link>
            <Link
              href="#process"
              className="bg-white hover:bg-gray-100 text-[#1B4332] text-lg px-8 py-4 min-w-[200px] rounded-2xl transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-8 text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
            <span className="font-semibold text-white">Important Notice:</span> We provide claims advisory, documentation and workflow support services only.
          </p>
        </div>
      </div>
    </section>
  );
}