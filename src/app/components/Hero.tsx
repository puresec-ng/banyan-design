import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="pt-36 pb-16 md:pt-40 md:pb-24 bg-[#1B4332]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-xl mb-8 text-white">
            Your Trusted Partner for{' '}
            <span className="text-green-300 block mt-2">Efficient Claims Management & Financial Advisory</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Experience seamless claims processing with Nigeria's leading technology-driven claims consultancy
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/submit-claim" 
              className="bg-[#E67635] hover:bg-[#d16426] text-white text-lg px-8 py-4 min-w-[200px] rounded-2xl transition-colors"
            >
              Submit a Claim
            </Link>
            <Link 
              href="#process" 
              className="bg-white hover:bg-gray-100 text-[#1B4332] text-lg px-8 py-4 min-w-[200px] rounded-2xl transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 