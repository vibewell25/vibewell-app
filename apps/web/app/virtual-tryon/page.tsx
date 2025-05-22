import { Metadata } from "next";
import { products } from "@/lib/mock-data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Virtual Try-On | VibeWell",
  description: "Virtually try on beauty products before you buy with our AR technology",
};

// Filter products that are eligible for virtual try-on
const tryOnProducts = products.filter(product => 
  product.category === "Makeup" || 
  product.category === "Hair Care" ||
  product.name.includes("Color")
);

// Helper function to safely get category name
function getCategoryName(category: any): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return '';
}

export default function VirtualTryOnPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Virtual Try-On Experience</h1>
        <p className="text-muted-foreground max-w-3xl">
          Experience our products virtually before you buy. Our AR technology lets you see how makeup, 
          hair colors, and skincare products will look on you in real-time.
        </p>
      </div>
      
      {/* Feature Showcase */}
      <div className="relative rounded-xl overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1596446593710-2c9c72e1155a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
          alt="Virtual Try-On Technology" 
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-3">
              See It On You
            </h2>
            <p className="text-white/90 mb-4">
              Our advanced AR technology lets you visualize how products will look on your unique features.
            </p>
            <div className="flex gap-3">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Try Camera Mode
              </button>
              <button className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 rounded-md hover:bg-white/30">
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Choose a Product</h3>
            <p className="text-muted-foreground">
              Browse our collection of virtual try-on enabled products and select one you'd like to try.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Activate Camera</h3>
            <p className="text-muted-foreground">
              Enable your device camera or upload a selfie to create your digital canvas.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">See the Results</h3>
            <p className="text-muted-foreground">
              Watch as our AR technology applies the product to your image in real-time with realistic effects.
            </p>
          </div>
        </div>
      </div>
      
      {/* Available Products */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Products Available for Try-On</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tryOnProducts.map(product => (
            <div key={product.id} className="bg-card rounded-lg shadow overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Try It On
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{getCategoryName(product.category)}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Link href={`/products/${product.id}`} className="text-sm text-primary hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Virtual Try-On Demo */}
      <div className="bg-card rounded-lg shadow p-6 mb-10">
        <h2 className="text-2xl font-bold mb-6">Interactive Demo</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-muted rounded-lg overflow-hidden relative min-h-[400px] flex items-center justify-center">
            <div className="text-center p-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Camera Access Required</h3>
              <p className="text-muted-foreground mb-4">
                Enable your camera to experience the virtual try-on feature
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Enable Camera
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-3">Selected Product</h3>
              <p className="text-muted-foreground text-sm mb-3">
                No product selected. Choose a product from the list below to get started.
              </p>
              <div className="space-y-2">
                <div className="bg-background rounded p-2 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors">
                  <img 
                    src={tryOnProducts[0]?.imageUrl} 
                    alt={tryOnProducts[0]?.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tryOnProducts[0]?.name}</p>
                    <p className="text-xs text-muted-foreground">{getCategoryName(tryOnProducts[0]?.category)}</p>
                  </div>
                </div>
                <div className="bg-background rounded p-2 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors">
                  <img 
                    src={tryOnProducts[1]?.imageUrl} 
                    alt={tryOnProducts[1]?.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tryOnProducts[1]?.name}</p>
                    <p className="text-xs text-muted-foreground">{getCategoryName(tryOnProducts[1]?.category)}</p>
                  </div>
                </div>
                <div className="bg-background rounded p-2 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors">
                  <img 
                    src={tryOnProducts[2]?.imageUrl} 
                    alt={tryOnProducts[2]?.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tryOnProducts[2]?.name}</p>
                    <p className="text-xs text-muted-foreground">{getCategoryName(tryOnProducts[2]?.category)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-3">Adjustments</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Intensity</label>
                  <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Shade</label>
                  <div className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F5D0C5] cursor-pointer ring-2 ring-primary ring-offset-2"></span>
                    <span className="w-6 h-6 rounded-full bg-[#E0B0A0] cursor-pointer"></span>
                    <span className="w-6 h-6 rounded-full bg-[#C08577] cursor-pointer"></span>
                    <span className="w-6 h-6 rounded-full bg-[#8E5C4E] cursor-pointer"></span>
                    <span className="w-6 h-6 rounded-full bg-[#573B35] cursor-pointer"></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">
                Save Result
              </button>
              <div className="flex justify-between mt-3">
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Reset
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Share
                </button>
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
            <h3 className="font-medium mb-2">Is my photo or video saved anywhere?</h3>
            <p className="text-muted-foreground">
              No, your privacy is important to us. All processing happens directly on your device, 
              and your photos or videos are not stored on our servers unless you explicitly choose to save or share your results.
            </p>
          </div>
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">How accurate is the virtual try-on?</h3>
            <p className="text-muted-foreground">
              Our AR technology provides a realistic approximation of how products will look on you. 
              While we strive for accuracy, results may vary slightly from the actual product application.
            </p>
          </div>
          <div className="border-b border-border pb-4">
            <h3 className="font-medium mb-2">Which devices are supported?</h3>
            <p className="text-muted-foreground">
              The virtual try-on feature works on most modern smartphones, tablets, and computers with cameras. 
              For the best experience, we recommend using the latest version of Chrome, Safari, or Firefox on a device with a front-facing camera.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Can I try multiple products at once?</h3>
            <p className="text-muted-foreground">
              Yes! You can layer different products to create a complete look. Simply add products one at a time 
              to see how they work together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 