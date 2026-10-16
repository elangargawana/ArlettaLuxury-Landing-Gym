<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// import { useRouter } from 'vue-router'
import Skeleton from 'primevue/skeleton'
// import Dialog from 'primevue/dialog'
// import Button from 'primevue/button'
import Select from 'primevue/select'
// import { useToast } from 'primevue/usetoast'
// import authState from '@/stores/auth'
import HeroMembership from '@/components/landing/membership/HeroMembership.vue'
import BenefitsBar from '@/components/landing/membership/BenefitsBar.vue'
import BundleCard from '@/components/landing/membership/BundleCard.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
// import SignatureVerificationModal from '@/components/booking/SignatureVerificationModal.vue'
import { getBundlePackages, type BundlePackage } from '@/services/bundleService'
import { getGyms, type Gym } from '@/services/gymService'
// import { createSignature, createPayment } from '@/services/paymentService'

// const router = useRouter()
// const toast = useToast()

const WA_NUMBER = '6285168602728'

// ── State ─────────────────────────────────────────────────────────────────
const bundles = ref<BundlePackage[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const gyms = ref<Gym[]>([])
const selectedGymId = ref<number | null>(null)
const gymsLoading = ref(false)

// const selectedBundle = ref<BundlePackage | null>(null)
// const showSignatureModal = ref(false)
// const showPaymentModal = ref(false)
// let createdSignatureId: number | null = null
// let pendingStartAt: string | undefined

// ── Load data ─────────────────────────────────────────────────────────────
const loadBundles = async () => {
  try {
    loading.value = true
    error.value = null
    const params: Record<string, unknown> = {}
    if (selectedGymId.value) params.gym_id = selectedGymId.value
    bundles.value = await getBundlePackages(params)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Gagal memuat paket bundle'
    console.warn('Failed to load bundle packages', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  gymsLoading.value = true
  try {
    const gymList = await getGyms()
    gyms.value = gymList
    if (gymList.length) selectedGymId.value = gymList[0]?.id ?? null
  } catch (err) {
    console.warn('Failed to load gyms', err)
  } finally {
    gymsLoading.value = false
  }
  await loadBundles()
})

watch(selectedGymId, () => {
  loadBundles()
})

// ── PAYMENT FLOW (sementara dinonaktifkan — redirect ke WA) ─────────────────

/** Redirect langsung ke WhatsApp untuk pembelian bundle */
const handleBuy = (bundle: BundlePackage) => {
  const message = encodeURIComponent(
    `Halo, saya tertarik untuk membeli paket bundle "${bundle.name}" di ${bundle.gym.name}. Mohon informasi lebih lanjut.`,
  )
  window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank')
}

// /** Step 1 (lama) — User klik "Beli Sekarang" */
// const handleBuy = (bundle: BundlePackage) => {
//   selectedBundle.value = bundle
//   if (!authState.isLoggedIn) { router.push('/signup'); return }
//   showSignatureModal.value = true
// }
//
// /** Step 2 — Setelah signature dikonfirmasi: simpan signature ke server → buka payment modal */
// const onSignatureConfirmed = async (signatureData?: string, startAt?: string) => {
//   try {
//     if (!signatureData) throw new Error('Signature tidak ditemukan')
//     const payloadSig: { signature_data: string; membership_plan_id?: number | string } = { signature_data: signatureData }
//     const resp = await createSignature(payloadSig as unknown as { signature_data: string; membership_plan_id?: number })
//     createdSignatureId = resp?.id ?? null
//     pendingStartAt = startAt
//     toast.add({ severity: 'success', summary: 'Tanda tangan tersimpan', detail: 'Verifikasi berhasil.', life: 3000 })
//     showSignatureModal.value = false
//     showPaymentModal.value = true
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err)
//     toast.add({ severity: 'error', summary: 'Tanda tangan gagal', detail: message, life: 5000 })
//   }
// }
//
// /** Step 3 — Pilih metode pembayaran */
// const proceedToPayment = async (method: 'va' | 'qris') => {
//   try {
//     if (!selectedBundle.value) throw new Error('Tidak ada paket bundle yang dipilih')
//     toast.add({ severity: 'info', summary: 'Membuat pembayaran', detail: 'Sedang memproses pembayaran Anda...', life: 3000 })
//     const payloadPayment: Record<string, unknown> = { gym_id: selectedBundle.value.gym.id, transaction_type: 'bundle', type_id: selectedBundle.value.id, payment_method: method }
//     if (pendingStartAt) payloadPayment.start_at = pendingStartAt
//     const resp = await createPayment(payloadPayment as unknown as Parameters<typeof createPayment>[0])
//     showPaymentModal.value = false
//     if (resp.payment_url) { window.open(resp.payment_url, '_blank') }
//     else if ((resp as Record<string, unknown>).snap_token) { window.open(`https://app.sandbox.midtrans.com/snap/v2/vtweb/${(resp as Record<string, unknown>).snap_token}`, '_blank') }
//     else if (resp.token) { window.open(`https://app.sandbox.midtrans.com/snap/v2/vtweb/${resp.token}`, '_blank') }
//     else { toast.add({ severity: 'success', summary: 'Pembayaran berhasil dibuat', detail: 'Transaksi Anda berhasil dibuat.', life: 3000 }) }
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err)
//     toast.add({ severity: 'error', summary: 'Pembayaran gagal', detail: message, life: 5000 })
//   }
// }

// ── Static content ────────────────────────────────────────────────────────
const benefits = [
  {
    icon: 'pi-star',
    title: 'Paket Lengkap',
    description: 'Membership + sesi PT dalam satu harga terbaik',
  },
  {
    icon: 'pi-shield',
    title: 'Hemat Lebih Banyak',
    description: 'Harga bundle lebih terjangkau dibanding beli terpisah',
  },
  {
    icon: 'pi-user',
    title: 'Trainer Profesional',
    description: 'Dibimbing langsung oleh personal trainer berpengalaman',
  },
  {
    icon: 'pi-clock',
    title: 'Akses Fleksibel',
    description: 'Gunakan sesi PT sesuai jadwal yang Anda inginkan',
  },
]
</script>

<template>
  <div class="min-h-screen bg-(--bg-dark)">
    <!-- Hero Section -->
    <HeroMembership
      title="Paket Bundle"
      subtitle="Dapatkan membership gym dan sesi personal trainer dalam satu paket hemat. Capai target kebugaran lebih cepat dengan bimbingan profesional."
    />

    <!-- Benefits Bar -->
    <BenefitsBar :benefits="benefits" />

    <!-- Bundle Cards Section -->
    <section class="section-padding relative overflow-hidden" style="margin-top: -1px">
      <ParticleBackground />

      <div class="container-custom relative z-10 py-12">
        <div class="h-8" />

        <!-- Gym Branch Filter (sama seperti membership) -->
        <div class="flex justify-center mb-8">
          <div class="w-full max-w-xs">
            <Select
              v-model="selectedGymId"
              :options="gyms"
              optionLabel="name"
              optionValue="id"
              placeholder="Select Gym Branch"
              :loading="gymsLoading"
              class="w-full"
            />
            <p class="text-xs text-(--text-muted) mt-2 text-center">
              Pastikan pilih cabang yang diinginkan sebelum membeli
            </p>
          </div>
        </div>

        <!-- Section Heading -->
        <div class="text-center mb-12">
          <h2 class="heading-lg text-white mb-3">Pilih Paket Bundle Terbaik Anda</h2>
          <p class="text-(--text-secondary) max-w-xl mx-auto text-sm leading-relaxed">
            Kombinasi membership dan sesi PT yang sudah kami kurasi untuk memaksimalkan hasil
            latihan Anda.
          </p>
        </div>

        <!-- Error State -->
        <div v-if="error && !loading" class="bundle-state">
          <i class="pi pi-exclamation-triangle text-3xl text-amber-400 mb-3" />
          <p class="text-(--text-secondary) mb-4">{{ error }}</p>
          <Button label="Coba Lagi" icon="pi pi-refresh" @click="loadBundles" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && !bundles.length" class="bundle-state">
          <i class="pi pi-inbox text-4xl text-(--text-muted) mb-4" />
          <p class="text-(--text-muted) text-lg font-medium">Belum ada paket bundle tersedia</p>
          <p class="text-(--text-muted) text-sm mt-1">Pantau terus untuk penawaran terbaru.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Skeleton Loading -->
          <template v-if="loading">
            <div
              v-for="i in 3"
              :key="i"
              class="glass-card p-6 md:p-8 rounded-2xl border-2 border-white/10 flex flex-col gap-5"
            >
              <div class="flex flex-col gap-2">
                <Skeleton width="40%" height="1rem" />
                <Skeleton width="65%" height="1.75rem" />
                <Skeleton width="80%" height="0.875rem" />
              </div>
              <Skeleton width="55%" height="2.5rem" />
              <div class="flex flex-col gap-3 p-4 rounded-xl border border-white/10">
                <div v-for="j in 2" :key="j" class="flex items-center gap-3">
                  <Skeleton shape="circle" size="2rem" />
                  <div class="flex flex-col gap-1 flex-1">
                    <Skeleton width="50%" height="0.75rem" />
                    <Skeleton width="35%" height="0.9rem" />
                  </div>
                </div>
              </div>
              <Skeleton width="100%" height="2.75rem" borderRadius="8px" class="mt-auto" />
            </div>
          </template>

          <!-- Actual Bundle Cards -->
          <BundleCard
            v-else
            v-for="bundle in bundles"
            :key="bundle.id"
            :bundle="bundle"
            @buy="handleBuy"
          />
        </div>
      </div>
    </section>

    <!-- Signature & Payment modals (sementara dinonaktifkan — pembelian via WhatsApp) -->
    <!--
    <SignatureVerificationModal
      :visible="showSignatureModal"
      @update:visible="(v) => (showSignatureModal = v)"
      :member-name="authState.user?.name"
      :membership-plan="selectedBundle ? selectedBundle.name : 'Paket Bundle'"
      :membership-id="null"
      :membership-duration-days="selectedBundle?.membership_duration_in_days ?? null"
      @confirmed="onSignatureConfirmed"
    />

    <Dialog
      :visible="showPaymentModal"
      @update:visible="(v) => (showPaymentModal = v)"
      header="Pilih Metode Pembayaran"
      :modal="true"
      class="w-full max-w-md"
    >
      <div class="space-y-4 p-4">
        <div v-if="selectedBundle" class="bundle-payment-summary">
          <p class="text-white font-bold text-base">{{ selectedBundle.name }}</p>
          <p class="text-(--text-muted) text-sm mt-1">{{ selectedBundle.gym.name }}</p>
        </div>
        <p class="text-(--text-secondary) text-sm">
          Pilih metode pembayaran untuk menyelesaikan pembelian paket bundle Anda.
        </p>
        <div class="grid grid-cols-1 gap-3">
          <Button label="Virtual Account (Transfer Bank)" icon="pi pi-building" class="btn" @click="proceedToPayment('va')" />
          <Button label="QRIS" icon="pi pi-qrcode" class="btn" @click="proceedToPayment('qris')" />
          <Button label="Batal" class="p-button-text text-(--text-secondary)" @click="showPaymentModal = false" />
        </div>
      </div>
    </Dialog>
    -->
  </div>
</template>

<style scoped>
.bundle-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.bundle-payment-summary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
}
</style>
