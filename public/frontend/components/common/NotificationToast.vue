<template>
  <Teleport to="body">
    <div class="notification-container" v-if="notifications.length > 0">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification-${notification.type}`]"
          @click="remove(notification.id)"
        >
          <div class="notification-content">
            <span class="notification-icon">
              <i v-if="notification.type === 'success'" class="fa-solid fa-check-circle"></i>
              <i v-else-if="notification.type === 'error'" class="fa-solid fa-exclamation-circle"></i>
              <i v-else-if="notification.type === 'warning'" class="fa-solid fa-exclamation-triangle"></i>
              <i v-else class="fa-solid fa-info-circle"></i>
            </span>
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" @click.stop="remove(notification.id)">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const { notifications, remove } = useNotifications()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.notification:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.notification-success {
  border-left-color: #10b981;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  font-size: 16px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.notification-close:hover {
  color: #1f2937;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>

