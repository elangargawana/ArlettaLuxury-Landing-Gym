<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { BundlePackage } from '@/services/bundleService'

const props = defineProps<{
  bundle: BundlePackage
}>()

const emit = defineEmits<{
  (e: 'buy', bundle: BundlePackage): void
}>()

const formatPrice = (price: string) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(price))

const formatDuration = (days: number) => {
  if (days % 30 === 0) {
    const months = days / 30
    return `${months} bulan`
  }
  return `${days} hari`
}

const getDiscountedPrice = (price: string, bundle: BundlePackage) => {
  const numPrice = Number(price)
  const percentPromo = bundle.promos.find((p) => p.type === 'discount_percent')
  if (percentPromo) {
    const discount = (numPrice * Number(percentPromo.value)) / 100
    return numPrice - discount
  }
  return null
}

const discountedPrice = getDiscountedPrice(props.bundle.price, props.bundle)

const getPromoLabel = (bundle: BundlePackage) => {
  if (!bundle.promos.length) return null
  const promo = bundle.promos[0]
  if (!promo) return null
  if (promo.type === 'discount_percent') return `${promo.value}% OFF`
  return null
}

const promoLabel = getPromoLabel(props.bundle)
</script>

<template>
  <div
    v-animateonscroll="{ enterClass: 'animate-scalein', leaveClass: 'animate-fadeout' }"
    class="bundle-card"
  >
    <!-- Promo Badge -->
    <div v-if="promoLabel" class="promo-badge">
      <i class="pi pi-tag mr-1" />{{ promoLabel }}
    </div>

    <!-- Header -->
    <div class="bundle-card__header">
      <div class="bundle-card__gym-tag">
        <i class="pi pi-map-marker mr-1 text-xs" />
        {{ bundle.gym.name }}
      </div>
      <h3 class="bundle-card__name">{{ bundle.name }}</h3>
      <p v-if="bundle.description" class="bundle-card__description">{{ bundle.description }}</p>
    </div>

    <!-- Price -->
    <div class="bundle-card__price-block">
      <template v-if="discountedPrice">
        <span class="bundle-card__price-original">{{ formatPrice(bundle.price) }}</span>
        <span class="bundle-card__price-final">{{ formatPrice(String(discountedPrice)) }}</span>
      </template>
      <span v-else class="bundle-card__price-final">{{ formatPrice(bundle.price) }}</span>
    </div>

    <!-- Features -->
    <div class="bundle-card__features">
      <div class="bundle-card__feature-item">
        <span class="bundle-card__feature-icon"><i class="pi pi-calendar" /></span>
        <div>
          <p class="bundle-card__feature-label">Durasi Membership</p>
          <p class="bundle-card__feature-value">{{ formatDuration(bundle.membership_duration_in_days) }}</p>
        </div>
      </div>
      <div class="bundle-card__feature-item">
        <span class="bundle-card__feature-icon"><i class="pi pi-user" /></span>
        <div>
          <p class="bundle-card__feature-label">Sesi Personal Trainer</p>
          <p class="bundle-card__feature-value">{{ bundle.pt_sessions }} sesi</p>
        </div>
      </div>
    </div>

    <!-- Promo Code -->
    <div v-if="bundle.promos.length" class="bundle-card__promos">
      <div
        v-for="promo in bundle.promos"
        :key="promo.code ?? promo.type"
        class="bundle-card__promo-row"
      >
        <Tag
          v-if="promo.has_code && promo.code"
          :value="promo.code"
          class="bundle-card__promo-tag"
        />
        <span class="bundle-card__promo-desc">
          <template v-if="promo.type === 'discount_percent'">
            Diskon {{ promo.value }}% dengan kode promo
          </template>
          <template v-else>
            Promo tersedia
          </template>
        </span>
      </div>
    </div>

    <!-- CTA -->
    <div class="bundle-card__cta">
      <Button
        label="Beli Sekarang"
        icon="pi pi-shopping-cart"
        class="w-full py-3 text-base font-semibold"
        @click="emit('buy', bundle)"
      />
    </div>
  </div>
</template>

<style scoped>
.bundle-card {
  position: relative;
  background: var(--glass-bg, rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(16px);
  border: 2px solid var(--primary, #7c3aed);
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.bundle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.2);
}

.promo-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
}

.bundle-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bundle-card__gym-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary, #7c3aed);
  background: rgba(124, 58, 237, 0.12);
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  width: fit-content;
}

.bundle-card__name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.bundle-card__description {
  font-size: 0.85rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
  line-height: 1.5;
}

.bundle-card__price-block {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.bundle-card__price-original {
  font-size: 0.9rem;
  color: var(--text-muted, #9ca3af);
  text-decoration: line-through;
}

.bundle-card__price-final {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bundle-card__features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.bundle-card__feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bundle-card__feature-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary, #7c3aed);
  flex-shrink: 0;
}

.bundle-card__feature-label {
  font-size: 0.72rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

.bundle-card__feature-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.bundle-card__promos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bundle-card__promo-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bundle-card__promo-tag {
  background: rgba(245, 158, 11, 0.15) !important;
  color: #f59e0b !important;
  border: 1px solid rgba(245, 158, 11, 0.3) !important;
  font-weight: 700;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.bundle-card__promo-desc {
  font-size: 0.78rem;
  color: var(--text-muted, #9ca3af);
}

.bundle-card__cta {
  margin-top: auto;
}
</style>
