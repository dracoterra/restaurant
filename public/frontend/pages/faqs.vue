<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader title="Frequently asked question" />
    <!-- Page Header End -->

    <!-- Page Faqs Start -->
    <div class="page-faqs">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <!-- Service Sidebar Start -->
            <div class="faq-sidebar">
              <!-- Service Category List Start -->
              <div class="faq-catagery-list wow fadeInUp">
                <ul>
                  <li v-for="category in faqCategories" :key="category.id">
                    <a :href="`#${category.id}`" @click.prevent="scrollToCategory(category.id)">
                      {{ category.name }}
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Service Category List End -->

              <!-- Sidebar Cta Box Start -->
              <div class="sidebar-cta-box wow fadeInUp" data-wow-delay="0.2s">
                <div class="icon-box">
                  <img src="/images/icon-sidebar-cta.svg" alt="">
                </div>
                <div class="cta-contact-content">
                  <h3>You have different questions?</h3>
                  <p>Our team will answer all your questions. we ensure a quick response.</p>
                </div>
                <div class="cta-contact-btn">
                  <a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="btn-default btn-highlighted">
                    <img src="/images/icon-sidebar-cta-phone.svg" alt=""> {{ settings.phone }}
                  </a>
                </div>
              </div>
              <!-- Sidebar Cta Box End -->
            </div>
            <!-- Service Sidebar End -->
          </div>

          <div class="col-lg-8">
            <!-- Page FAQs Catagery Start -->
            <div class="page-faqs-catagery">
              <div 
                v-for="category in faqCategories" 
                :key="category.id"
                class="faq-accordion page-faq-accordion"
                :id="category.id"
              >
                <div class="section-title">
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    {{ category.name }}
                  </h2>
                </div>
                <!-- FAQ Accordion Start -->
                <div class="faq-accordion" :id="`accordion-${category.id}`">
                  <div 
                    v-for="(faq, index) in category.faqs" 
                    :key="faq.id || index"
                    class="accordion-item wow fadeInUp"
                    :data-wow-delay="`${index * 0.1}s`"
                  >
                    <h2 class="accordion-header" :id="`heading-${category.id}-${index}`">
                      <button 
                        class="accordion-button" 
                        :class="{ collapsed: index !== 0 }"
                        type="button" 
                        data-bs-toggle="collapse" 
                        :data-bs-target="`#collapse-${category.id}-${index}`"
                        :aria-expanded="index === 0 ? 'true' : 'false'"
                        :aria-controls="`collapse-${category.id}-${index}`"
                      >
                        {{ faq.question }}
                      </button>
                    </h2>
                    <div 
                      :id="`collapse-${category.id}-${index}`"
                      class="accordion-collapse collapse" 
                      :class="{ show: index === 0 }"
                      :aria-labelledby="`heading-${category.id}-${index}`"
                      :data-bs-parent="`#accordion-${category.id}`"
                    >
                      <div class="accordion-body">
                        <p>{{ faq.answer }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- FAQ Accordion End -->
              </div>
            </div>
            <!-- Page FAQs Catagery End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Faqs End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'

interface FAQ {
  id?: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  faqs: FAQ[]
}

const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

const faqCategories = ref<FAQCategory[]>([
  {
    id: 'general_information',
    name: 'general information',
    faqs: [
      {
        id: '1',
        question: 'What are your restaurant\'s hours of operation?',
        answer: 'We are open daily from 11:00 AM to 11:00 PM. Join us for lunch, dinner, or anything in between!'
      },
      {
        id: '2',
        question: 'Do you offer takeout or delivery services?',
        answer: 'Yes, we offer both takeout and delivery services. You can place orders through our website or by calling us directly.'
      },
      {
        id: '3',
        question: 'Do you accommodate dietary restrictions?',
        answer: 'Absolutely! We offer vegetarian, vegan, and gluten-free options. Please inform our staff about any dietary restrictions when placing your order.'
      }
    ]
  },
  {
    id: 'services_and-offerings',
    name: 'services and offerings',
    faqs: [
      {
        id: '4',
        question: 'Do you offer catering services for events?',
        answer: 'Yes, we provide catering services for events of all sizes. Contact us in advance to discuss your event needs and menu preferences.'
      },
      {
        id: '5',
        question: 'Can I make a reservation?',
        answer: 'Yes, you can make a reservation through our website or by calling us. We recommend making reservations in advance, especially for weekends.'
      },
      {
        id: '6',
        question: 'Do you have private dining options?',
        answer: 'Yes, we offer private dining spaces for special occasions and events. Please contact us to discuss availability and arrangements.'
      }
    ]
  },
  {
    id: 'pricing_and_payment',
    name: 'pricing and payment',
    faqs: [
      {
        id: '7',
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, credit cards, debit cards, and digital payment methods. All major credit cards are welcome.'
      },
      {
        id: '8',
        question: 'Do you offer any discounts or promotions?',
        answer: 'Yes, we regularly offer special promotions and discounts. Check our website or follow us on social media to stay updated on current offers.'
      }
    ]
  },
  {
    id: 'orders_and_delivery',
    name: 'orders and delivery',
    faqs: [
      {
        id: '9',
        question: 'What is your delivery area?',
        answer: 'We deliver within a 10-mile radius of our restaurant. Delivery fees may apply based on distance.'
      },
      {
        id: '10',
        question: 'How long does delivery take?',
        answer: 'Delivery typically takes 30-45 minutes, depending on your location and order volume. We strive to deliver your food fresh and hot.'
      },
      {
        id: '11',
        question: 'Can I track my order?',
        answer: 'Yes, once you place an order, you will receive a confirmation with tracking information. You can also call us for order status updates.'
      }
    ]
  }
])

const scrollToCategory = (categoryId: string) => {
  const element = document.getElementById(categoryId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  await settingsStore.fetchSettings()

  useHead({
    title: 'FAQs - Restaurant',
    meta: [
      { name: 'description', content: 'Frequently asked questions about our restaurant' }
    ]
  })

  if (process.client) {
    setTimeout(() => {
      if ((window as any).WOW) {
        new (window as any).WOW().init()
      }
    }, 500)
  }
})
</script>

