import { PixelButton } from "@/components/landingpage/PixelButton";
import { MagicSparkle } from "@/components/landingpage/MagicSparkle";
import heroImage from "@/assets/pixel-library-hero.png";

const Index = () => {
    const handleSignUp = () => {
        // TODO: Implement sign up/sign in functionality
        console.log("Sign up clicked");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <main className="relative overflow-hidden">
                {/* Background sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                    <MagicSparkle className="absolute top-1/4 left-1/4 magic-sparkle" size="sm" />
                    <MagicSparkle className="absolute top-1/3 right-1/3 magic-sparkle" size="md" style={{animationDelay: "0.5s"}} />
                    <MagicSparkle className="absolute top-2/3 left-1/6 magic-sparkle" size="lg" style={{animationDelay: "1s"}} />
                    <MagicSparkle className="absolute bottom-1/4 right-1/4 magic-sparkle" size="sm" style={{animationDelay: "1.5s"}} />
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

                        {/* Left Column - Text Content */}
                        <div className="space-y-8 floating">
                            <div className="space-y-6">
                                <h1 className="pixel-title text-foreground">
                                    BookSwap
                                </h1>
                                <p className="pixel-subtitle text-muted-foreground max-w-md">
                                    The cozy corner of the internet where book lovers gather to share stories,
                                    discover new adventures, and build a community around the magic of reading.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-pixel-green rounded-sm"></div>
                                    <span className="text-foreground font-pixel">Share your library with friends</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-pixel-orange rounded-sm"></div>
                                    <span className="text-foreground font-pixel">Discover new favorite books</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-pixel-purple rounded-sm"></div>
                                    <span className="text-foreground font-pixel">Connect with fellow readers</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <PixelButton onClick={handleSignUp} className="text-xl px-12 py-6">
                                    Join the Library 📚
                                </PixelButton>
                                <p className="text-sm text-muted-foreground mt-3 font-pixel">
                                    Free to join • No credit card required
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Hero Image */}
                        <div className="relative">
                            <div className="relative rounded-lg overflow-hidden shadow-book">
                                <img
                                    src={heroImage}
                                    alt="Pixel art library with cozy reading nooks and magical floating books"
                                    className="w-full h-auto"
                                    style={{imageRendering: "pixelated"}}
                                />
                                <div className="absolute inset-0 bg-gradient-hero pointer-events-none"></div>
                            </div>

                            {/* Floating elements around the image */}
                            <div className="absolute -top-4 -right-4">
                                <MagicSparkle size="lg" />
                            </div>
                            <div className="absolute -bottom-4 -left-4">
                                <MagicSparkle size="md" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <section className="py-16 border-t border-border bg-card/50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold font-pixel text-foreground mb-8">
                            Ready to start your reading adventure?
                        </h2>
                        <p className="text-lg text-muted-foreground font-pixel max-w-2xl mx-auto mb-8">
                            Join thousands of book lovers who've already discovered their next favorite story through PixelShelf.
                            Your perfect reading community awaits.
                        </p>
                        <PixelButton onClick={handleSignUp} className="text-lg px-8 py-5">
                            Get Started Now ✨
                        </PixelButton>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Index;
