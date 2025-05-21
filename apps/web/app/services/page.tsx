import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { ServiceCard } from "@/components/services/service-card";
import { Service, Category } from "@vibewell/types";

export const metadata: Metadata = {
  title: "Services | VibeWell",
  description: "Browse beauty and wellness services",
};

export default async function ServicesPage() {
  // Fetch all active services with their categories
  const supabase = createServerClient();
  const { data: servicesData } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("isActive", true)
    .order("createdAt", { ascending: false });

  // Convert services data to proper Service type with Date objects
  const services = servicesData?.map(serviceData => {
    // Create a properly-typed service
    const service: Service & { category?: Category } = {
      id: serviceData.id,
      providerId: serviceData.providerId,
      title: serviceData.title,
      description: serviceData.description,
      price: serviceData.price,
      duration: serviceData.duration,
      isActive: serviceData.isActive,
      isPrivate: serviceData.isPrivate,
      categoryId: serviceData.categoryId,
      createdAt: new Date(serviceData.createdAt),
      updatedAt: new Date(serviceData.updatedAt),
    };
    
    // Add the category if it exists, mapping fields correctly
    if (serviceData.category) {
      const categoryData = serviceData.category;
      service.category = {
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description ?? undefined,
        icon: categoryData.iconUrl ?? undefined,
        createdAt: new Date(categoryData.createdAt),
        updatedAt: new Date(categoryData.updatedAt),
      };
    }
    
    return service;
  }) || [];

  // Fetch all categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          Browse our beauty and wellness services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="category"
                  defaultChecked
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="all" className="ml-2 text-sm">
                  All Categories
                </label>
              </div>

              {categories?.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    id={category.id}
                    name="category"
                    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={category.id} className="ml-2 text-sm">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="text-lg font-medium mb-4">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Min</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="mt-1 w-full rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Max</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    className="mt-1 w-full rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="text-lg font-medium mb-4">Duration</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="duration-30"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="duration-30" className="ml-2 text-sm">
                    Under 30 minutes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="duration-60"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="duration-60" className="ml-2 text-sm">
                    30 - 60 minutes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="duration-90"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="duration-90" className="ml-2 text-sm">
                    60 - 90 minutes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="duration-120"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="duration-120" className="ml-2 text-sm">
                    Over 90 minutes
                  </label>
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No services found</h3>
              <p className="text-muted-foreground">
                There are no services available that match your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}