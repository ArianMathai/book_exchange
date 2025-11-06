import { Button } from "@/components/ui/button";
import { BookOpen, Users, Heart, Smile, LogIn } from "lucide-react";
import heroBooks from "@/assets/BookReaderLandingPage.png";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 relative overflow-hidden">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-amber-200 bg-gradient-to-r  bg-amber-950 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/30 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-yellow-100" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-50 tracking-tight font-playfair">BookSwap</h1>
                <p className="text-xs text-yellow-100/80 hidden sm:block">Where books find new adventures</p>
              </div>
            </div>
            
            {/* Sign In Button */}
            <Button
              onClick={() => navigate('/app/home')}
              className="bg-yellow-600 hover:bg-yellow-500 text-amber-900 font-medium px-6 py-2 rounded-lg transition-colors duration-200 border border-yellow-500"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16">
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-amber-900 mb-4 sm:mb-6 leading-tight">
                  BookSwap
                </h1>
                <div className="text-xl sm:text-2xl lg:text-3xl font-playfair italic text-amber-800 mb-6 sm:mb-8">
                  Where books find new adventures
                </div>

                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 text-base sm:text-lg text-amber-900/80">
                  <p className="flex items-center justify-center lg:justify-start gap-3">
                    <BookOpen className="text-amber-700 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span>That dusty novel collecting dust? Someone's dying to read it!</span>
                  </p>
                  <p className="flex items-center justify-center lg:justify-start gap-3">
                    <Users className="text-amber-700 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span>Connect with fellow bookworms in your neighborhood</span>
                  </p>
                  <p className="flex items-center justify-center lg:justify-start gap-3">
                    <Heart className="text-orange-700 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span>Share stories, spread joy, build community</span>
                  </p>
                  <p className="flex items-center justify-center lg:justify-start gap-3">
                    <Smile className="text-yellow-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="text-center lg:text-left">Because hoarding books is only fun until you run out of space</span>
                  </p>
                </div>

                <Button
                    onClick={() => navigate('/app/home')}
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-yellow-50 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto border border-amber-500"
                >
                  Join the Book-Loving Community
                </Button>
              </div>

              {/* Right Content - Hero Image */}
              <div className="flex-1 w-full mt-8 lg:mt-0">
                <div className="relative max-w-md sm:max-w-lg mx-auto lg:max-w-none">
                  <img
                      src={heroBooks}
                      alt="A magical collection of books waiting to be shared"
                      className="w-full h-auto rounded-2xl shadow-book hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-orange-700 text-yellow-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-playfair italic shadow-lg rotate-12 text-sm sm:text-base">
                    Books seeking adventure!
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Section */}
          <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-yellow-200">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-amber-900 mb-6 sm:mb-8">
                  The Great Book Liberation Movement
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-orange-700 mb-3 sm:mb-4">1</div>
                    <h3 className="text-lg sm:text-xl font-playfair font-semibold text-amber-800 mb-2 sm:mb-3">
                      List Your Books
                    </h3>
                    <p className="text-sm sm:text-base text-amber-700/80">
                      Snap a photo, add a title, and let your books mingle with the world
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-orange-700 mb-3 sm:mb-4">2</div>
                    <h3 className="text-lg sm:text-xl font-playfair font-semibold text-amber-800 mb-2 sm:mb-3">
                      Discover & Request
                    </h3>
                    <p className="text-sm sm:text-base text-amber-700/80">
                      Browse nearby collections and request that perfect read
                    </p>
                  </div>

                  <div className="text-center sm:col-span-2 md:col-span-1">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-orange-700 mb-3 sm:mb-4">3</div>
                    <h3 className="text-lg sm:text-xl font-playfair font-semibold text-amber-800 mb-2 sm:mb-3">
                      Share & Spread Joy
                    </h3>
                    <p className="text-sm sm:text-base text-amber-700/80">
                      Meet fellow book lovers and watch stories travel the world
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-100/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-yellow-300">
                  <p className="text-lg sm:text-xl font-playfair italic text-amber-800 leading-relaxed">
                    "A book is a dream you hold in your hands. Now imagine sharing that dream
                    with someone who needs it most. That's BookSwap magic."
                  </p>
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-amber-600">
                    — Some Very Wise Book Lover (probably)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
            <div className="bg-amber-100/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-amber-200">
              <p className="text-base sm:text-lg font-playfair italic text-amber-800 mb-3 sm:mb-4">
                Ready to turn your bookshelf into a neighborhood library?
              </p>
              <p className="text-sm sm:text-base text-amber-700/80">
                Join thousands of book lovers who've discovered that the best stories are the ones we share.
              </p>
            </div>
          </footer>
        </main>
      </div>
  );
};

export default LandingPage;