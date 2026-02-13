<template>
  <footer class="bg-[#1a120b] text-white pt-24 pb-12 overflow-hidden relative">
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
      <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        
        <div class="space-y-6">
          <h2 class="font-serif text-3xl font-bold">Life<span class="text-amber-500">&</span>Coffee</h2>
          <p class="text-stone-400 leading-relaxed font-light">
            Dedicated to the pursuit of the perfect roast. We ethically source and craft small-batch coffee for the discerning palate.
          </p>
          <div class="flex gap-4">
            <a v-for="social in ['fb', 'ig', 'tw']" :key="social" href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-all duration-300">
              <span class="text-xs uppercase font-bold">{{ social }}</span>
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-serif text-xl mb-8 border-b border-amber-500/30 pb-2 inline-block">Explore</h3>
          <ul class="space-y-4 text-stone-400 font-light">
            <li v-for="link in ['Our Roastery', 'Sustainability', 'Wholesale', 'Brew Guides']" :key="link">
              <a href="#" class="hover:text-amber-400 transition-colors">-- {{ link }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-serif text-xl mb-8 border-b border-amber-500/30 pb-2 inline-block">Concierge</h3>
          <ul class="space-y-4 text-stone-400 font-light">
            <li v-for="link in ['Shipping Policy', 'Returns', 'Loyalty Program', 'Track Order']" :key="link">
              <a href="#" class="hover:text-amber-400 transition-colors">{{ link }}</a>
            </li>
          </ul>
        </div>

        <div class="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 class="font-serif text-xl mb-4">Stay Inspired</h3>
          <p class="text-stone-400 text-sm mb-6">Join our newsletter for exclusive recipes and first access to new origins.</p>
          <div class="relative">
            <input type="email" placeholder="Email Address" class="w-full bg-white/5 border-b border-white/20 py-3 pr-10 outline-none focus:border-amber-500 transition-colors">
            <button class="absolute right-0 top-1/2 -translate-y-1/2 text-amber-500">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-6 grayscale opacity-50 hover:opacity-100 transition-opacity">
          <span class="text-[10px] tracking-widest uppercase text-stone-500">Accepted:</span>
          <div v-for="pay in ['ABA', 'ACLEDA', 'VISA']" :key="pay" class="text-xs font-bold">{{ pay }}</div>
        </div>
        
        <div class="text-stone-500 text-[11px] tracking-widest uppercase">
          &copy; 2024 Life&Coffee. Crafted in Phnom Penh.
        </div>
      </div>
    </div>
  </footer>
</template>