<template>
  <div class="reserve-table">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="reserve-table-content">
            <div class="section-title" v-if="subtitle || title">
              <h3 class="wow fadeInUp" v-if="subtitle">{{ subtitle }}</h3>
              <h3 class="wow fadeInUp" v-else>reserve a table</h3>
              <h2 class="text-anime-style-2" data-cursor="-opaque" v-if="title">
                <span v-html="formatTitle(title)"></span>
              </h2>
              <h2 class="text-anime-style-2" data-cursor="-opaque" v-else>reserve now your table and <span>enjoy dining experience.</span></h2>
            </div>
            <div class="reserve-table-body wow fadeInUp" data-wow-delay="0.2s" v-if="hours && hours.length > 0">
              <h3>open hours</h3>
              <ul>
                <li v-for="(hour, index) in hours" :key="index">
                  {{ hour.days }} <span>{{ hour.time }}</span>
                </li>
              </ul>
            </div>
            <div class="reserve-table-body wow fadeInUp" data-wow-delay="0.2s" v-else>
              <h3>open hours</h3>
              <ul>
                <li>Mon - Thu <span>10:00 AM - 09:00 PM</span></li>
                <li>Fri - Sat <span>09:00 AM - 10:00 PM</span></li>
                <li>Sun <span>Closed</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="reserve-table-form">
            <form @submit.prevent="handleReservation" class="wow fadeInUp">
              <div class="row">
                <div class="form-group col-md-12 mb-4">
                  <label class="form-label">your name</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    class="form-control" 
                    placeholder="e.g. John" 
                    required
                  >
                </div>
                <div class="form-group col-md-6 mb-4">
                  <label class="form-label">email address</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    class="form-control" 
                    placeholder="e.g. John@example.com" 
                    required
                  >
                </div>
                <div class="form-group col-md-6 mb-4">
                  <label class="form-label">phone number</label>
                  <input 
                    v-model="form.phone" 
                    type="text" 
                    class="form-control" 
                    placeholder="e.g. + 123 456 8792" 
                    required
                  >
                </div>
                <div class="form-group col-md-4 mb-4">
                  <label class="form-label">date</label>
                  <input 
                    v-model="form.date" 
                    type="date" 
                    class="form-control" 
                    required
                  >
                </div>
                <div class="form-group col-md-4 mb-4">
                  <label class="form-label">time</label>
                  <select v-model="form.time" class="form-control form-select" required>
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
                  <select v-model="form.person" class="form-control form-select" required>
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
                    <button type="submit" class="btn-default">reserve now</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Hour {
  days: string
  time: string
}

interface Props {
  subtitle?: string
  title?: string
  hours?: Hour[]
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  title: '',
  hours: () => []
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  person: ''
})

const handleReservation = () => {
  // TODO: Implementar envío de formulario
  console.log('Reservation submitted:', form.value)
  alert('Reservation submitted! (This is a placeholder)')
}

// Helper para formatear el título con spans
const formatTitle = (title: string) => {
  if (!title) return ''
  return title.replace(/\<span\>(.*?)\<\/span\>/gi, '<span>$1</span>')
}
</script>

