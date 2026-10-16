<script setup lang="ts">
const props = defineProps<{ title: string; paragraphs: string[] }>()
</script>

<template>
  <section class="py-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2
            v-animateonscroll="{ enterClass: 'animate-fadeinup', leaveClass: 'animate-fadeout' }"
            class="text-3xl font-bold text-white mb-6"
          >
            {{ props.title }}
          </h2>
          <div class="space-y-4 text-(--text-secondary) leading-relaxed">
            <p
              v-for="(p, i) in props.paragraphs"
              :key="i"
              v-animateonscroll="{ enterClass: 'animate-fadeinup', leaveClass: 'animate-fadeout' }"
            >
              {{ p }}
            </p>
          </div>
        </div>
        <div class="relative">
          <img
            v-animateonscroll="{ enterClass: 'animate-fadein', leaveClass: 'animate-fadeout' }"
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=500&fit=crop"
            alt="Our Gym"
            class="rounded-2xl w-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>
