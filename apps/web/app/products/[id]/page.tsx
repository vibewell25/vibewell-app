import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, providers } from "@/lib/mock-data";
import { ProductGrid } from "@/components/products/product-grid";

type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return {
      title: "Product Not Found | VibeWell",
      description: "The requested product could not be found",
    };
  }
  
  return {
    title: `${product.name} | VibeWell Shop`,
    description: product.description || "Beauty and wellness product on VibeWell",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return notFound();
  }
  
  // Find the provider for this product
  const provider = providers.find(p => p.id === product.providerId);
  
  // Find related products (same category or same provider)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.providerId === product.providerId))
    .slice(0, 4);
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link 
          href="/products" 
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Products
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain aspect-square"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-6">
            {product.category && (
              <div className="text-sm text-primary mb-2">
                {typeof product.category === 'string' 
                  ? product.category 
                  : (product.category && 'name' in product.category) 
                    ? product.category.name 
                    : 'Uncategorized'}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-2xl font-bold text-primary mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Availability:</span>
              {product.inventory > 0 ? (
                <span className="text-green-600">{product.inventory} in stock</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </div>
            
            {provider && (
              <div className="flex items-center gap-2 mb-6">
                <span className="font-medium">Provider:</span>
                <Link 
                  href={`/providers/${provider.id}`}
                  className="text-primary hover:underline"
                >
                  {provider.firstName} {provider.lastName}
                </Link>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-24">
                  <label htmlFor="quantity" className="text-sm text-muted-foreground block mb-1">
                    Quantity
                  </label>
                  <select 
                    id="quantity" 
                    className="w-full rounded-md border px-3 py-2"
                    disabled={product.inventory <= 0}
                  >
                    {[...Array(Math.min(10, product.inventory))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                disabled={product.inventory <= 0}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Product Details</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-muted-foreground">Category:</span>
                <span>
                  {typeof product.category === 'string' 
                    ? product.category 
                    : (product.category && 'name' in product.category) 
                      ? product.category.name 
                      : 'Uncategorized'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">Item ID:</span>
                <span>{product.id}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
} 