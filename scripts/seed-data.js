#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env.local if it exists
dotenv.config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function seedDatabase() {
  console.log('🌱 Seeding VibeWell database with sample data...');

  // Seed categories
  const categories = [
    { name: 'Hair Care', description: 'Haircuts, coloring, styling and treatments', iconUrl: '/icons/hair.svg' },
    { name: 'Skin Care', description: 'Facials, skin treatments and consultations', iconUrl: '/icons/skin.svg' },
    { name: 'Massage', description: 'Various massage techniques for relaxation and healing', iconUrl: '/icons/massage.svg' },
    { name: 'Nail Care', description: 'Manicures, pedicures and nail art', iconUrl: '/icons/nails.svg' },
    { name: 'Makeup', description: 'Makeup application and lessons', iconUrl: '/icons/makeup.svg' },
    { name: 'Wellness', description: 'Yoga, meditation and holistic treatments', iconUrl: '/icons/wellness.svg' },
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    const { error } = await supabase.from('categories').upsert([category], { onConflict: 'name' });
    if (error) {
      console.error(`Error creating category ${category.name}:`, error);
    } else {
      console.log(`✅ Created category: ${category.name}`);
    }
  }

  // Fetch created categories for reference
  const { data: categoryData } = await supabase.from('categories').select('*');
  const categoryMap = categoryData.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {});

  // Create sample provider users
  const providers = [
    {
      email: 'sarah.stylist@example.com',
      password: 'Password123!',
      firstName: 'Sarah',
      lastName: 'Stylist',
      role: 'PROVIDER',
      displayName: 'Sarah\'s Beauty Studio',
      bio: 'Expert hair stylist with 10+ years of experience specializing in color and cuts.',
      phone: '555-123-4567',
      address: '123 Beauty Lane',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
    },
    {
      email: 'mike.massage@example.com',
      password: 'Password123!',
      firstName: 'Mike',
      lastName: 'Masseur',
      role: 'PROVIDER',
      displayName: 'Mike\'s Massage Therapy',
      bio: 'Licensed massage therapist offering therapeutic and relaxation massages.',
      phone: '555-987-6543',
      address: '456 Wellness Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
    },
    {
      email: 'nina.nails@example.com',
      password: 'Password123!',
      firstName: 'Nina',
      lastName: 'Nguyen',
      role: 'PROVIDER',
      displayName: 'Nina\'s Nail Studio',
      bio: 'Nail artist specializing in creative designs and healthy nail care.',
      phone: '555-456-7890',
      address: '789 Fashion Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
  ];

  console.log('Creating provider accounts...');
  for (const provider of providers) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: provider.email,
      password: provider.password,
      email_confirm: true,
    });

    if (authError) {
      console.error(`Error creating auth user for ${provider.email}:`, authError);
      continue;
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').upsert([{
      userId: authData.user.id,
      email: provider.email,
      firstName: provider.firstName,
      lastName: provider.lastName,
      displayName: provider.displayName,
      bio: provider.bio,
      phone: provider.phone,
      address: provider.address,
      city: provider.city,
      state: provider.state,
      zipCode: provider.zipCode,
      role: provider.role,
    }]);

    if (profileError) {
      console.error(`Error creating profile for ${provider.email}:`, profileError);
    } else {
      console.log(`✅ Created provider: ${provider.displayName}`);
    }
  }

  // Fetch created provider profiles for reference
  const { data: providerProfiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'PROVIDER');

  // Create sample services for each provider
  const serviceTemplates = {
    'Sarah\'s Beauty Studio': [
      {
        title: 'Women\'s Haircut & Style',
        description: 'Complete haircut and styling service tailored to your preferences and face shape. Includes consultation, shampoo, conditioning, cut, and style.',
        price: 65,
        duration: 60,
        categoryName: 'Hair Care',
      },
      {
        title: 'Full Color Service',
        description: 'Professional hair coloring service. Includes consultation, application, processing time, shampoo, conditioning, and style.',
        price: 90,
        duration: 120,
        categoryName: 'Hair Care',
      },
      {
        title: 'Highlights/Lowlights',
        description: 'Partial or full highlights or lowlights to add dimension to your hair. Includes consultation, application, processing, shampoo, conditioning, and style.',
        price: 110,
        duration: 150,
        categoryName: 'Hair Care',
      },
    ],
    'Mike\'s Massage Therapy': [
      {
        title: 'Swedish Massage',
        description: 'Relaxing full-body massage using long, flowing strokes to reduce tension, improve circulation and promote relaxation.',
        price: 85,
        duration: 60,
        categoryName: 'Massage',
      },
      {
        title: 'Deep Tissue Massage',
        description: 'Therapeutic massage focusing on deeper layers of muscle tissue to release chronic tension and pain.',
        price: 95,
        duration: 60,
        categoryName: 'Massage',
      },
      {
        title: 'Hot Stone Massage',
        description: 'Relaxing massage that uses heated stones to warm and loosen muscles, allowing for deeper relaxation.',
        price: 110,
        duration: 90,
        categoryName: 'Massage',
      },
    ],
    'Nina\'s Nail Studio': [
      {
        title: 'Classic Manicure',
        description: 'Basic nail care including cuticle treatment, nail shaping, hand massage, and polish application.',
        price: 35,
        duration: 30,
        categoryName: 'Nail Care',
      },
      {
        title: 'Deluxe Pedicure',
        description: 'Comprehensive foot care including soak, exfoliation, callus treatment, nail care, massage, and polish.',
        price: 55,
        duration: 45,
        categoryName: 'Nail Care',
      },
      {
        title: 'Gel Nail Art',
        description: 'Long-lasting gel polish with custom nail art designs of your choice.',
        price: 65,
        duration: 60,
        categoryName: 'Nail Care',
      },
    ],
  };

  console.log('Creating services for providers...');
  for (const provider of providerProfiles) {
    const services = serviceTemplates[provider.displayName] || [];
    
    for (const service of services) {
      const categoryId = categoryMap[service.categoryName];
      
      if (!categoryId) {
        console.error(`Category not found: ${service.categoryName}`);
        continue;
      }
      
      const { error } = await supabase.from('services').insert([{
        providerId: provider.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        categoryId: categoryId,
        isActive: true,
        isPrivate: false,
      }]);
      
      if (error) {
        console.error(`Error creating service ${service.title}:`, error);
      } else {
        console.log(`✅ Created service: ${service.title} for ${provider.displayName}`);
      }
    }
  }

  // Create sample customer accounts
  const customers = [
    {
      email: 'alice.customer@example.com',
      password: 'Password123!',
      firstName: 'Alice',
      lastName: 'Anderson',
      role: 'CUSTOMER',
    },
    {
      email: 'bob.customer@example.com',
      password: 'Password123!',
      firstName: 'Bob',
      lastName: 'Brown',
      role: 'CUSTOMER',
    },
  ];

  console.log('Creating customer accounts...');
  for (const customer of customers) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: customer.email,
      password: customer.password,
      email_confirm: true,
    });

    if (authError) {
      console.error(`Error creating auth user for ${customer.email}:`, authError);
      continue;
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').upsert([{
      userId: authData.user.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      role: customer.role,
    }]);

    if (profileError) {
      console.error(`Error creating profile for ${customer.email}:`, profileError);
    } else {
      console.log(`✅ Created customer: ${customer.firstName} ${customer.lastName}`);
    }
  }

  console.log('🎉 Database seeding completed!');
}

// Run the seed function
seedDatabase().catch(err => {
  console.error('Error during database seeding:', err);
  process.exit(1);
}); 