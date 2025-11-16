<template>
  <footer class="main-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <!-- Footer Content Start -->
          <div class="footer-content">
            <!-- Footer Logo Start -->
            <div class="footer-logo">
              <img :src="settings.logo" alt="Logo">
            </div>
            <!-- Footer Logo End -->

            <!-- Footer Contact Box Start -->
            <div class="footer-contact-box">
              <!-- Footer Contact Item Start -->
              <div class="footer-contact-item">
                <div class="icon-box">
                  <img src="/images/icon-location.svg" alt="Location">
                </div>
                <div class="footer-contact-content">
                  <p>{{ settings.address }}</p>
                </div>
              </div>
              <!-- Footer Contact Item End -->

              <!-- Footer Contact Item Start -->
              <div class="footer-contact-item">
                <div class="icon-box">
                  <img src="/images/icon-phone.svg" alt="Phone">
                </div>
                <div class="footer-contact-content">
                  <p><a :href="`tel:${settings.phone.replace(/\s/g, '')}`">{{ settings.phone }}</a></p>
                </div>
              </div>
              <!-- Footer Contact Item End -->
            </div>
            <!-- Footer Contact Box End -->
          </div>
          <!-- Footer Content End -->
        </div>
      </div>

      <!-- Footer Copyright Section Start -->
      <div class="footer-copyright">
        <div class="row align-items-center">
          <div class="col-md-6">
            <!-- Footer Social Icon Start -->
            <div class="footer-social-icon">
              <ul>
                <li v-if="settings.social_media.dribbble">
                  <a :href="settings.social_media.dribbble" target="_blank" rel="noopener">
                    <i class="fa-brands fa-dribbble"></i>
                  </a>
                </li>
                <li v-if="settings.social_media.facebook">
                  <a :href="settings.social_media.facebook" target="_blank" rel="noopener">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li v-if="settings.social_media.instagram">
                  <a :href="settings.social_media.instagram" target="_blank" rel="noopener">
                    <i class="fa-brands fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
            <!-- Footer Social Icon End -->
          </div>

          <div class="col-lg-6 col-md-6">
            <!-- Footer Copyright Start -->
            <div class="footer-copyright-text">
              <p>{{ settings.copyright }}</p>
            </div>
            <!-- Footer Copyright End -->
          </div>
        </div>
      </div>
      <!-- Footer Copyright Section End -->
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const settings = computed(() => settingsStore.settings)

onMounted(async () => {
  if (settingsStore.settings.logo === '/images/logo.svg') {
    await settingsStore.fetchSettings()
  }
})
</script>

