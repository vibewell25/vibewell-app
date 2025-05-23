import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Skin Analysis | VibeWell",
  description: "Get a personalized skin analysis and product recommendations with our AI technology",
};

export default function SkinAnalysisPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">AI Skin Analysis</h1>
        <p className="text-muted-foreground max-w-3xl">
          Get personalized skincare recommendations based on an AI analysis of your skin concerns, 
          texture, and needs.
        </p>
      </div>
      
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Analyze Your Skin</h2>
          <p className="text-muted-foreground mb-6">
            Upload a selfie or take a photo to get started. Our AI will analyze your skin and provide 
            personalized recommendations based on your unique characteristics.
          </p>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Take Photo</span>
              </button>
              <button className="flex-1 bg-white text-gray-800 border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Photo</span>
              </button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>For best results, use a well-lit front-facing photo without makeup</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center min-h-[320px]">
          <div className="text-center p-8">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop or click to upload a selfie<br />
              JPEG or PNG, max 10MB
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload a Photo</h3>
            <p className="text-muted-foreground">
              Take a selfie or upload an existing photo of your face without makeup.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-muted-foreground">
              Our advanced AI analyzes your skin for concerns, texture, hydration, and more.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Results</h3>
            <p className="text-muted-foreground">
              Review a detailed report of your skin's characteristics and concerns.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">4</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <p className="text-muted-foreground">
              Get personalized product and routine recommendations for your skin type.
            </p>
          </div>
        </div>
      </div>
      
      {/* What We Analyze */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What We Analyze</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Hydration Levels</h3>
            <p className="text-muted-foreground">
              We assess how hydrated your skin is and identify any areas of dryness that need attention.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Texture Analysis</h3>
            <p className="text-muted-foreground">
              We look at your skin's smoothness, identify rough patches, and detect pore visibility.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Skin Tone Evenness</h3>
            <p className="text-muted-foreground">
              We detect areas of hyperpigmentation, dark spots, and uneven coloration.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">UV Damage</h3>
            <p className="text-muted-foreground">
              We identify signs of sun damage and assess risk factors for premature aging.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Sensitivity & Redness</h3>
            <p className="text-muted-foreground">
              We detect areas of redness, inflammation, and potential skin sensitivity.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fine Lines & Wrinkles</h3>
            <p className="text-muted-foreground">
              We identify the presence and depth of fine lines and wrinkles around key areas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Sample Results */}
      <div className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Sample Analysis Results</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Skin Health Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Skin Health</span>
                    <span className="text-sm font-medium text-green-600">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Hydration</span>
                      <span className="text-sm text-orange-600">48%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Texture</span>
                      <span className="text-sm text-green-600">82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Even Tone</span>
                      <span className="text-sm text-yellow-600">63%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Fine Lines</span>
                      <span className="text-sm text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium mb-4">Key Findings</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-1 text-orange-500">●</span>
                    <span>Your skin shows signs of dehydration, especially in the cheek area.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-1 text-yellow-500">●</span>
                    <span>Mild hyperpigmentation detected around the forehead.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-1 text-green-500">●</span>
                    <span>Excellent skin texture with minimal roughness.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Routine</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Morning Hydration</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with a gentle cleanser followed by a hydrating toner and hyaluronic acid serum.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Sun Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply a broad-spectrum SPF 30+ sunscreen daily to prevent further hyperpigmentation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Evening Repair</h4>
                    <p className="text-sm text-muted-foreground">
                      Use a vitamin C serum to address hyperpigmentation followed by a rich moisturizer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  <div>
                    <h4 className="font-medium text-sm">Hydrating Essence Toner</h4>
                    <p className="text-xs text-muted-foreground">For dehydration</p>
                  </div>
                  <div className="ml-auto">
                    <Link href="#" className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  <div>
                    <h4 className="font-medium text-sm">Vitamin C Brightening Serum</h4>
                    <p className="text-xs text-muted-foreground">For hyperpigmentation</p>
                  </div>
                  <div className="ml-auto">
                    <Link href="#" className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  <div>
                    <h4 className="font-medium text-sm">Ceramide Moisture Lock Cream</h4>
                    <p className="text-xs text-muted-foreground">For barrier protection</p>
                  </div>
                  <div className="ml-auto">
                    <Link href="#" className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">How accurate is the skin analysis?</h3>
            <p className="text-muted-foreground">
              Our AI skin analysis tool is highly accurate and has been trained on thousands of diverse skin samples. 
              However, the quality of your photo will affect the results, so we recommend using a well-lit, 
              front-facing photo without makeup for the most accurate analysis.
            </p>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">Is my photo stored or shared?</h3>
            <p className="text-muted-foreground">
              Your privacy is important to us. Your photo is processed securely and is not stored 
              permanently unless you explicitly save your analysis. We never share your photos with 
              third parties.
            </p>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">How often should I analyze my skin?</h3>
            <p className="text-muted-foreground">
              We recommend analyzing your skin every 4-6 weeks to track changes and measure the 
              effectiveness of your skincare routine. Your skin changes with seasons, stress levels, 
              and other factors, so regular analysis helps keep your routine optimized.
            </p>
          </div>
          
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">Can I purchase the recommended products?</h3>
            <p className="text-muted-foreground">
              Yes! All recommended products are available for purchase through our shop. 
              You can buy individual products or opt for a custom bundle based on your analysis 
              results for additional savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 