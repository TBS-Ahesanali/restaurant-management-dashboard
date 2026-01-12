import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Phone, MapPin, ArrowRight, Star, Menu, X } from 'lucide-react';

import Header from './Header';
import Footer from './Footer';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <header className='relative min-h-screen flex items-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent'></div>
        </div>

        <div className='relative container mx-auto px-4 lg:px-8 pt-20'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6'>
              <Star className='text-yellow-400 w-4 h-4' />
              <span className='text-yellow-400 text-sm font-medium'>Michelin Star Restaurant</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              Experience Fine Dining <br className='hidden sm:block' />
              at Its Best
            </h1>
            <p className='text-lg text-gray-200 mb-8 max-w-xl'>Indulge in exquisite flavors and impeccable service at Gourmet Haven. Where every meal tells a story.</p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/menu'
                className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 duration-200'
              >
                View Menu
                <ArrowRight size={20} />
              </Link>
              <Link
                to='/reservations'
                className='inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 duration-200'
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* <div className='absolute bottom-0 left-0 right-0'>
          <div className='container mx-auto px-4 lg:px-8 py-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 bg-white/10 backdrop-blur-md rounded-t-2xl p-6 lg:p-8'>
              {[
                { number: '10+', label: 'Years of Excellence' },
                { number: '50+', label: 'Signature Dishes' },
                { number: '200+', label: 'Wine Selection' },
                { number: '4.9', label: 'Customer Rating' },
              ].map((stat, index) => (
                <div key={index} className='text-center'>
                  <p className='text-2xl lg:text-3xl font-bold text-white mb-1'>{stat.number}</p>
                  <p className='text-sm text-white/80'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </header>

      {/* Features Section */}
      <section className='py-20 lg:py-32 bg-gray-50'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <h2 className='text-3xl lg:text-4xl font-bold mb-6'>Why Choose Us</h2>
            <p className='text-gray-600 text-lg'>Experience the perfect blend of culinary excellence and exceptional service</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
            {[
              {
                icon: <ChefHat size={32} />,
                title: 'Master Chefs',
                description: 'Our world-class chefs create unforgettable culinary experiences with passion and precision.',
              },
              {
                icon: <Clock size={32} />,
                title: 'Opening Hours',
                description: 'Mon-Sun: 11:00 AM - 11:00 PM\nHappy Hour: 4:00 PM - 7:00 PM',
              },
              {
                icon: <MapPin size={32} />,
                title: 'Location',
                description: '123 Gourmet Street\nCulinary District, Food City',
              },
            ].map((feature, index) => (
              <div key={index} className='bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                <div className='w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6'>
                  <div className='text-blue-600'>{feature.icon}</div>
                </div>
                <h3 className='text-xl font-semibold mb-4'>{feature.title}</h3>
                <p className='text-gray-600 whitespace-pre-line'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className='py-20 lg:py-32'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <span className='text-blue-600 font-medium'>Our Specialties</span>
            <h2 className='text-3xl lg:text-4xl font-bold mt-2 mb-6'>Special Menu</h2>
            <p className='text-gray-600 text-lg'>Discover our chef's carefully curated selection of signature dishes</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                name: 'Grilled Salmon',
                price: '$28',
                description: 'Fresh Atlantic salmon with herbs and lemon butter sauce',
              },
              {
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                name: 'Beef Wellington',
                price: '$45',
                description: 'Premium beef tenderloin wrapped in puff pastry',
              },
              {
                image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                name: 'Lobster Thermidor',
                price: '$52',
                description: 'Classic French dish with fresh lobster and rich sauce',
              },
            ].map((dish, index) => (
              <div key={index} className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                <div className='relative'>
                  <img src={dish.image} alt={dish.name} className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300' />
                  <div className='absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold'>{dish.price}</div>
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-semibold mb-2'>{dish.name}</h3>
                  <p className='text-gray-600 mb-4'>{dish.description}</p>
                  <button className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-20 lg:py-32 bg-gray-900 text-white'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <span className='inline-block text-blue-400 font-medium mb-2'>Reservations</span>
              <h2 className='text-3xl lg:text-4xl font-bold mb-6'>Make a Reservation</h2>
              <p className='text-gray-400 mb-8 text-lg'>Book your table now and experience the finest dining in the city. For special requests, please call us directly.</p>
              <div className='flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-xl'>
                <div className='w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center'>
                  <Phone className='text-blue-400' size={24} />
                </div>
                <div>
                  <p className='text-sm text-gray-400'>For Reservations</p>
                  <p className='text-xl font-semibold'>+1 (555) 123-4567</p>
                </div>
              </div>
              <Link
                to='/reservations'
                className='inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 duration-200'
              >
                Book Now
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className='relative'>
              <div className='absolute -inset-4 bg-blue-600/20 rounded-2xl transform rotate-3'></div>
              <img
                src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                alt='Restaurant interior'
                className='relative w-full h-[400px] lg:h-[500px] object-cover rounded-2xl'
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
