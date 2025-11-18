<template>
  <div>
    <!-- Loading State -->
    <div v-if="pagesStore.loading" class="container py-5 text-center">
      <p>Cargando contenido...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="pagesStore.error" class="container py-5 text-center">
      <p class="text-danger">Error: {{ pagesStore.error }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Page Header Start -->
      <SectionsPageHeader :title="acf?.contactSubtitle || 'Contact us'" />
      <!-- Page Header End -->

      <!-- Page Contact Us Start -->
      <div class="page-contact-us">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <!-- Contect Us Content Start -->
              <div class="contact-us-content">
                <!-- Section Title Start -->
                <div class="section-title">
                  <h3 class="wow fadeInUp">{{ acf?.contactSubtitle || 'contact us' }}</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    {{ acf?.contactTitle || 'Get in touch with us' }}
                  </h2>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="acf?.contactDescription">
                    {{ acf.contactDescription }}
                  </p>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                    Have questions or feedback? Reach out to us through the form below, call us, or visit our restaurant. We're here to help and look forward to connecting with you!
                  </p>
                </div>
                <!-- Section Title End -->

              <!-- Contact Info List Start -->
              <div class="contact-info-list wow fadeInUp" data-wow-delay="0.4s">
                <ul>
                  <li>{{ settings.address }}</li>
                  <li><a :href="`tel:${settings.phone.replace(/\s/g, '')}`">{{ settings.phone }}</a></li>
                  <li><a :href="`mailto:${settings.email}`">{{ settings.email }}</a></li>
                </ul>
              </div>
              <!-- Contact Info List End -->

              <!-- Contact Social List Start -->
              <div class="contact-social-list wow fadeInUp" data-wow-delay="0.6s">
                <ul>
                  <li v-if="settings.social_media.dribbble">
                    <a :href="settings.social_media.dribbble" target="_blank" rel="noopener">
                      <i class="fa-brands fa-dribbble"></i>
                    </a>
                  </li>
                  <li v-if="settings.social_media.facebook">
                    <a :href="settings.social_media.facebook" target="_blank" rel="noopener">
                      <i class="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li v-if="settings.social_media.instagram">
                    <a :href="settings.social_media.instagram" target="_blank" rel="noopener">
                      <i class="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Contact Social List End -->
            </div>
            <!-- Contect Us Content End -->

            <div class="col-lg-6">
              <!-- Contact Form Start -->
              <div class="contact-form">
                <form @submit.prevent="handleSubmit" class="wow fadeInUp">
                  <div class="row">
                    <div class="form-group col-md-12 mb-4">
                      <label class="form-label">your name</label>
                      <input 
                        v-model="contactForm.name"
                        type="text" 
                        name="name" 
                        class="form-control" 
                        placeholder="e.g. John" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-6 mb-4">
                      <label class="form-label">email address</label>
                      <input 
                        v-model="contactForm.email"
                        type="email" 
                        name="email" 
                        class="form-control" 
                        placeholder="e.g. John@example.com" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-6 mb-4">
                      <label class="form-label">phone number</label>
                      <input 
                        v-model="contactForm.phone"
                        type="text" 
                        name="phone" 
                        class="form-control" 
                        placeholder="e.g. + 123 456 879 2" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-12 mb-5">
                      <label class="form-label">message</label>
                      <textarea 
                        v-model="contactForm.message"
                        name="message" 
                        class="form-control" 
                        rows="4" 
                        placeholder="Write Message.."
                      ></textarea>
                    </div>

                    <div class="col-md-12">
                      <button type="submit" class="btn-default" :disabled="submittingContact">
                        {{ submittingContact ? 'Enviando...' : 'submit inquiry' }}
                      </button>
                      <div v-if="contactMessage" class="h3 mt-3" :class="{ 'text-success': contactSuccess, 'text-danger': !contactSuccess }">
                        {{ contactMessage }}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <!-- Contact Form End -->
            </div>
          </div>
        </div>
      </div>
      <!-- Page Contact Us End -->

      <!-- Google Map Start -->
      <div class="google-map">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <!-- Google Map Start -->
              <div class="google-map-iframe" v-if="acf?.mapEmbed" v-html="acf.mapEmbed"></div>
              <div class="google-map-iframe" v-else>
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96737.10562045308!2d-74.08535042841811!3d40.739265258395164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1703158537552!5m2!1sen!2sin" 
                allowfullscreen 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              </div>
              <!-- Google Map End -->
            </div>
          </div>
        </div>
      </div>
      <!-- Google Map End -->

      <!-- Reserve Table Section Start -->
      <div class="reserve-table">
        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <!-- Reserve table Content Start -->
              <div class="reserve-table-content">
                <!-- Section Title Start -->
                <div class="section-title">
                  <h3 class="wow fadeInUp">reserve a table</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    reserve now your table and <span>enjoy dining experience.</span>
                  </h2>
                </div>
                <!-- Section Title End -->

                <!-- Reserve Table Body Start -->
                <div class="reserve-table-body wow fadeInUp" data-wow-delay="0.2s">
                  <h3>open hours</h3>
                  <ul>
                    <li>Mon - Thu <span>10:00 AM - 09:00 PM</span></li>
                    <li>Fri - Sat <span>09:00 AM - 10:00 PM</span></li>
                    <li>Sun <span>Closed</span></li>
                  </ul>
                </div>
                <!-- Reserve Table Body End -->
              </div>
              <!-- Reserve table Content End -->
            </div>

            <div class="col-lg-6">
              <!-- Reserve Table Form Start -->
              <div class="reserve-table-form">
                <form @submit.prevent="handleReservation" class="wow fadeInUp">
                  <div class="row">
                    <div class="form-group col-md-12 mb-4">
                      <label class="form-label">your name</label>
                      <input 
                        v-model="reservationForm.name"
                        type="text" 
                        name="name" 
                        class="form-control" 
                        placeholder="e.g. John" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-6 mb-4">
                      <label class="form-label">email address</label>
                      <input 
                        v-model="reservationForm.email"
                        type="email" 
                        name="email" 
                        class="form-control" 
                        placeholder="e.g. John@example.com" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-6 mb-4">
                      <label class="form-label">phone number</label>
                      <input 
                        v-model="reservationForm.phone"
                        type="text" 
                        name="phone" 
                        class="form-control" 
                        placeholder="e.g. + 123 456 8792" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-4 mb-4">
                      <label class="form-label">date</label>
                      <input 
                        v-model="reservationForm.date"
                        type="date" 
                        name="date" 
                        class="form-control" 
                        required
                      >
                    </div>

                    <div class="form-group col-md-4 mb-4">
                      <label class="form-label">time</label>
                      <select 
                        v-model="reservationForm.time"
                        name="time" 
                        class="form-control form-select" 
                        required
                      >
                        <option value="" disabled selected>Select time</option>
                        <option value="6_30pm">06:30 PM</option>
                        <option value="7_00pm">07:00 PM</option>
                        <option value="7_30pm">07:30 PM</option>
                        <option value="8_00pm">08:00 PM</option>
                        <option value="8_30pm">08:30 PM</option>
                        <option value="9_00pm">09:00 PM</option>
                      </select>
                    </div>

                    <div class="form-group col-md-4 mb-4">
                      <label class="form-label">Number Of Person</label>
                      <select 
                        v-model="reservationForm.person"
                        name="person" 
                        class="form-control form-select" 
                        required
                      >
                        <option value="" disabled selected>number of person</option>
                        <option value="1_person">1 Person</option>
                        <option value="5_person">5 Person</option>
                        <option value="10_person">10 Person</option>
                        <option value="15_person">15 Person</option>
                        <option value="20_person">20 Person</option>
                      </select>
                    </div>

                    <div class="col-lg-12">
                      <div class="reserve-table-btn">
                        <button type="submit" class="btn-default" :disabled="submittingReservation">
                          {{ submittingReservation ? 'Reservando...' : 'reserve now' }}
                        </button>
                        <div v-if="reservationMessage" class="h3 mt-3" :class="{ 'text-success': reservationSuccess, 'text-danger': !reservationSuccess }">
                          {{ reservationMessage }}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <!-- Reserve Table Form End -->
            </div>
          </div>
        </div>
      </div>
      <!-- Reserve Table Section End -->
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { usePagesStore, type Page } from '~/stores/pages'

// Meta tags
const pagesStore = usePagesStore()
const settingsStore = useSettingsStore()
const page = ref<Page | null>(null)
const settings = computed(() => settingsStore.settings)

// Computed para obtener campos ACF
const acf = computed(() => page.value?.acf?.contactPageSections)

const { 
  form: contactForm, 
  submit: submitContact, 
  isSubmitting: submittingContact, 
  submitSuccess: contactSuccess, 
  submitMessage: contactMessage,
  reset: resetContact
} = useForm(
  {
    name: '',
    email: '',
    phone: '',
    message: ''
  },
  {
    endpoint: '/contact',
    method: 'POST',
    onSuccess: () => {
      resetContact()
      const { success } = useNotifications()
      success('¡Gracias! Tu mensaje ha sido enviado exitosamente.')
    },
    onError: (error) => {
      const { error: showError } = useNotifications()
      showError(error.message || 'Error al enviar el mensaje')
    }
  }
)

const { 
  form: reservationForm, 
  submit: submitReservation, 
  isSubmitting: submittingReservation, 
  submitSuccess: reservationSuccess, 
  submitMessage: reservationMessage,
  reset: resetReservation
} = useForm(
  {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    person: ''
  },
  {
    endpoint: '/reservations',
    method: 'POST',
    onSuccess: () => {
      resetReservation()
      const { success } = useNotifications()
      success('Reserva realizada exitosamente. Te confirmaremos pronto.')
    },
    onError: (error) => {
      const { error: showError } = useNotifications()
      showError(error.message || 'Error al procesar la reserva')
    }
  }
)

const handleSubmit = async () => {
  await submitContact()
}

const handleReservation = async () => {
  await submitReservation()
}

onMounted(async () => {
  try {
    await settingsStore.fetchSettings()
    
    // Obtener página por slug
    page.value = await pagesStore.fetchPageBySlug('contact')
    
    // Actualizar meta tags si hay SEO
    if (page.value?.seo?.title) {
      useHead({
        title: page.value.seo.title,
        meta: [
          { name: 'description', content: page.value.seo.metaDesc || page.value.excerpt }
        ]
      })
    } else {
      useHead({
        title: 'Contact Us - Restaurant',
        meta: [
          { name: 'description', content: acf.value?.contactDescription || 'Get in touch with us' }
        ]
      })
    }
    
    // Inicializar animaciones
    if (process.client) {
      setTimeout(() => {
        if ((window as any).WOW) {
          new (window as any).WOW().init()
        }
      }, 500)
    }
  } catch (error) {
    // Error loading contact page
  }
})
</script>

