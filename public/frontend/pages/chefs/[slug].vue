<template>
  <div>
    <!-- Page Header Start -->
    <SectionsPageHeader :title="chef?.name || 'Chef Details'" />
    <!-- Page Header End -->

    <!-- Page Team Single Start -->
    <div class="page-team-single">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <!-- Team Single Image Start -->
            <div class="team-single-image wow fadeInUp">
              <figure class="image-anime">
                <img :src="chef?.image || '/images/team-1.jpg'" :alt="chef?.name || 'Chef'">
              </figure>
            </div>
            <!-- Team Single Image End -->
          </div>

          <div class="col-lg-8">
            <!-- Team Single Content Start -->
            <div class="team-single-content">
              <div class="team-single-content-body">
                <div class="section-title">
                  <h3 class="wow fadeInUp">{{ chef?.position || 'Chef' }}</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    {{ chef?.name || 'Chef Name' }}
                  </h2>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-if="chef?.bio">
                    {{ chef.bio }}
                  </p>
                  <p class="wow fadeInUp" data-wow-delay="0.2s" v-else>
                    Our talented chef brings years of experience and passion to every dish. With a commitment to excellence and innovation, they create memorable culinary experiences for our guests.
                  </p>
                </div>

                <!-- Team Social List Start -->
                <div class="team-social-list wow fadeInUp" data-wow-delay="0.4s" v-if="chef?.social">
                  <ul>
                    <li v-if="chef.social.dribbble">
                      <a :href="chef.social.dribbble" target="_blank" rel="noopener">
                        <i class="fa-brands fa-dribbble"></i>
                      </a>
                    </li>
                    <li v-if="chef.social.facebook">
                      <a :href="chef.social.facebook" target="_blank" rel="noopener">
                        <i class="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li v-if="chef.social.instagram">
                      <a :href="chef.social.instagram" target="_blank" rel="noopener">
                        <i class="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <!-- Team Social List End -->
              </div>

              <!-- Team Member Contact Form Start -->
              <div class="team-member-contact-form">
                <div class="section-title">
                  <h3 class="wow fadeInUp">get in touch</h3>
                  <h2 class="text-anime-style-2" data-cursor="-opaque">
                    Contact <span>{{ chef?.name || 'Chef' }}</span>
                  </h2>
                </div>

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
              </div>
              <!-- Team Member Contact Form End -->
            </div>
            <!-- Team Single Content End -->
          </div>
        </div>
      </div>
    </div>
    <!-- Page Team Single End -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Chef {
  id: string
  slug: string
  name: string
  position: string
  image: string
  bio?: string
  social?: {
    dribbble?: string
    facebook?: string
    instagram?: string
  }
}

const slug = computed(() => route.params.slug as string)

const chefs = ref<Chef[]>([
  {
    id: '1',
    slug: 'sophia-martinez',
    name: 'sophia martinez',
    position: 'executive chef',
    image: '/images/team-1.jpg',
    bio: 'With over 15 years of culinary experience, Sophia brings creativity and passion to every dish. Her expertise in fusion cuisine has earned her recognition in the culinary world.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '2',
    slug: 'liam-patel',
    name: 'liam patel',
    position: 'sous chef',
    image: '/images/team-2.jpg',
    bio: 'Liam specializes in traditional and modern cooking techniques, bringing a unique perspective to our kitchen. His attention to detail ensures every dish is perfect.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '3',
    slug: 'isabella-carter',
    name: 'isabella carter',
    position: 'pastry chef',
    image: '/images/team-3.jpg',
    bio: 'Isabella creates delightful desserts that are both beautiful and delicious. Her artistic approach to pastry making makes every dessert a masterpiece.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '4',
    slug: 'ethan-johnson',
    name: 'ethan johnson',
    position: 'restaurant manager',
    image: '/images/team-4.jpg',
    bio: 'Ethan ensures smooth operations and exceptional service. His dedication to customer satisfaction makes every visit memorable.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '5',
    slug: 'oliver-bennett',
    name: 'oliver bennett',
    position: 'executive chef',
    image: '/images/team-5.jpg',
    bio: 'Oliver brings innovation and excellence to our kitchen. His culinary vision drives our menu development and ensures we stay ahead of trends.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  },
  {
    id: '6',
    slug: 'james-anderson',
    name: 'james anderson',
    position: 'operations manager',
    image: '/images/team-6.jpg',
    bio: 'James oversees all aspects of restaurant operations, ensuring efficiency and quality in every detail. His leadership keeps our team running smoothly.',
    social: {
      dribbble: '#',
      facebook: '#',
      instagram: '#'
    }
  }
])

const chef = computed<Chef | null>(() => {
  return chefs.value.find(c => c.slug === slug.value) || null
})

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

const handleSubmit = async () => {
  await submitContact()
}

onMounted(() => {
  useHead({
    title: `${chef.value?.name || 'Chef'} - Restaurant`,
    meta: [
      { name: 'description', content: chef.value?.bio || 'Chef details' }
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

