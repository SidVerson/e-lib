<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <header class="relative bg-primary text-primary-foreground overflow-hidden">
      <div class="container mx-auto flex flex-col items-center justify-center text-center py-24 px-6 relative z-10">
        <h1 class="text-6xl font-extrabold leading-tight mb-4">
          Transform Your Reading Experience
        </h1>
        <p class="text-lg font-medium max-w-2xl mb-6">
          A modern e-library designed for seamless exploration and immersive reading. Thousands of books, just a click away.
        </p>
        <div class="flex gap-4 mt-6">
          <Button variant="solid" size="lg" class="bg-secondary text-secondary-foreground">
            <NuxtLink to="/books" >

            Explore Library
            </NuxtLink>
          </Button>
          <Button variant="outline" size="lg" class="border-secondary text-secondary-foreground" @click="learnMore">
            Learn More
          </Button>
        </div>
      </div>
      <!-- Decorative background gradients -->
      <div class="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background/0 to-background pointer-events-none"></div>
    </header>

    <!-- Features Section -->
    <section class="py-16 bg-muted text-muted-foreground">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold mb-8">
          Why Choose Us?
        </h2>
        <p class="max-w-3xl mx-auto text-lg mb-12">
          Whether you’re a casual reader or a knowledge seeker, our e-library is crafted to provide an exceptional experience tailored to you.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
              icon="heroicons:book-open"
              title="Vast Collection"
              description="Discover thousands of books across all genres and topics."
          />
          <FeatureCard
              icon="heroicons:device-mobile"
              title="Accessible Anywhere"
              description="Read on any device, anytime, anywhere, with ease."
          />
          <FeatureCard
              icon="heroicons:sparkles"
              title="Curated for You"
              description="Get personalized recommendations based on your preferences."
          />
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <footer class="relative py-16 bg-primary text-primary-foreground">
      <div class="container mx-auto text-center">
        <h2 class="text-5xl font-semibold mb-6">
          Start Your Journey Today
        </h2>
        <p class="text-lg max-w-2xl mx-auto mb-8">
          Dive into a world of knowledge and entertainment. Join the e-library revolution.
        </p>
        <Button variant="solid" size="lg" class="bg-secondary text-secondary-foreground" @click="signup">
          Get Started
        </Button>
      </div>
      <!-- Decorative elements -->
      <div class="absolute -top-24 right-0 w-96 h-96 bg-gradient-to-tr from-accent to-muted rounded-full opacity-20"></div>
      <div class="absolute -bottom-24 left-0 w-96 h-96 bg-gradient-to-bl from-accent to-muted rounded-full opacity-20"></div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // Disables the default layout for this page
})
// FeatureCard Component (inline for simplicity)
const FeatureCard = {
  props: ["icon", "title", "description"],
  template: `
    <div class="bg-card text-card-foreground rounded-lg shadow-md p-8 transition-transform transform hover:scale-105">
      <div class="flex justify-center items-center h-16 w-16 rounded-full bg-primary text-primary-foreground mx-auto mb-6">
        <Icon :name="icon" class="h-8 w-8" />
      </div>
      <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
      <p class="text-base">{{ description }}</p>
    </div>
  `,
};
const exploreLibrary = () => alert("Navigating to the library...");
const learnMore = () => alert("More info coming soon!");
const signup = () => alert("Sign up to start!");
</script>

<style scoped>
/* Add subtle animations */
button {
  @apply transition-transform transform hover:scale-105;
}

h1, h2, h3 {
  @apply transition-opacity duration-300;
}
</style>
