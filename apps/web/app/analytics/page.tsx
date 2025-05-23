import { Metadata } from "next";
import { bookings, services } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Analytics Dashboard | VibeWell",
  description: "View insights about your business performance and customer trends",
};

export default function AnalyticsPage() {
  // Calculate revenue trends by month
  const currentYear = new Date().getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Mock data for visualization
  const revenueByMonth = [
    { month: "Jan", revenue: 2450 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 3850 },
    { month: "Apr", revenue: 3100 },
    { month: "May", revenue: 4200 },
    { month: "Jun", revenue: 4800 },
    { month: "Jul", revenue: 5100 }
  ];
  
  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueByMonth.map(m => m.revenue));
  
  // Calculate completed bookings
  const completedBookings = bookings.filter(booking => booking.status === "COMPLETED").length;
  const totalBookings = bookings.length;
  const completionRate = Math.round((completedBookings / totalBookings) * 100);
  
  // Calculate service popularity
  const serviceFrequency = bookings.reduce<Record<string, number>>((acc, booking) => {
    const serviceId = booking.serviceId;
    if (!acc[serviceId]) acc[serviceId] = 0;
    acc[serviceId]++;
    return acc;
  }, {});
  
  // Sort services by booking frequency
  const popularServices = Object.entries(serviceFrequency)
    .map(([serviceId, count]) => {
      const service = services.find(s => s.id === serviceId);
      return {
        id: serviceId,
        name: service?.title || 'Unknown Service',
        count: count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          View insights about your business performance and customer trends.
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Revenue</div>
          <div className="text-3xl font-bold">$26,700</div>
          <div className="text-green-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>12.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Bookings</div>
          <div className="text-3xl font-bold">{totalBookings}</div>
          <div className="text-green-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>8.3% from last month</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-muted-foreground text-sm font-medium mb-2">Completion Rate</div>
          <div className="text-3xl font-bold">{completionRate}%</div>
          <div className="text-amber-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>2.1% from last month</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-muted-foreground text-sm font-medium mb-2">Avg. Booking Value</div>
          <div className="text-3xl font-bold">$78</div>
          <div className="text-green-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>5.2% from last month</span>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-card rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Revenue Trends</h2>
        <div className="h-80">
          <div className="flex h-64 items-end space-x-2">
            {revenueByMonth.map(month => (
              <div key={month.month} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all duration-200" 
                  style={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
                ></div>
                <div className="text-xs font-medium mt-2">{month.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Popular Services */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Most Popular Services</h2>
          <div className="space-y-4">
            {popularServices.map(service => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">{service.count}</span>
                  </div>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {Math.round((service.count / totalBookings) * 100)}% of bookings
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customer Demographics */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Customer Demographics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Age Distribution</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>18-24</span>
                    <span className="text-muted-foreground">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>25-34</span>
                    <span className="text-muted-foreground">42%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>35-44</span>
                    <span className="text-muted-foreground">28%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>45+</span>
                    <span className="text-muted-foreground">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Gender Split</h3>
              <div className="flex items-center justify-center h-32">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    {/* Circular segments for pie chart */}
                    <circle r="16" cx="16" cy="16" fill="#f0f0f0" />
                    <circle r="8" cx="16" cy="16" fill="white" />
                    <path d="M16,16 L16,0 A16,16 0 0,1 32,16 z" fill="#7C3AED" />
                    <path d="M16,16 L32,16 A16,16 0 0,1 16,32 z" fill="#9061F9" />
                    <path d="M16,16 L16,32 A16,16 0 0,1 0,16 z" fill="#D8B4FE" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-medium">Total</div>
                      <div className="text-xl font-bold">{totalBookings}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 text-center text-xs mt-2">
                <div>
                  <div className="w-3 h-3 bg-[#7C3AED] rounded-full mx-auto mb-1"></div>
                  <span>Female (68%)</span>
                </div>
                <div>
                  <div className="w-3 h-3 bg-[#9061F9] rounded-full mx-auto mb-1"></div>
                  <span>Male (24%)</span>
                </div>
                <div>
                  <div className="w-3 h-3 bg-[#D8B4FE] rounded-full mx-auto mb-1"></div>
                  <span>Other (8%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Retention Rate */}
      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Customer Retention</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Retention Rate</h3>
              <span className="text-2xl font-bold">76%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 mb-6">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "76%" }}></div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">New vs. Returning</h3>
              <div>
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                <span className="text-xs text-muted-foreground">New</span>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-3 mr-1"></span>
                <span className="text-xs text-muted-foreground">Returning</span>
              </div>
            </div>
            <div className="w-full flex h-8 mb-2 rounded-md overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: "32%" }}></div>
              <div className="bg-green-500 h-full" style={{ width: "68%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>32% New Customers</span>
              <span>68% Returning Customers</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Booking Frequency</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Once</span>
                <div className="w-3/4 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2-3 times</span>
                <div className="w-3/4 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">4-6 times</span>
                <div className="w-3/4 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">7+ times</span>
                <div className="w-3/4 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 