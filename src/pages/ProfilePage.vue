<template>
  <div class="q-pa-md q-gutter-md">

    <!-- Title and Subtitle -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2">
      <q-card-section>
        <div class="text-h5">My Profile</div>
        <div class="text-subtitle2">Update your personal information and preferences</div>
      </q-card-section>
    </q-card>

    <!-- Profile Form -->
    <q-card
      class="q-mt-md shadow-2 q-pa-lg"
      style="max-width: 600px; margin: auto; border-radius: 12px;"
      bordered
    >
      <q-card-section>

        <!-- Avatar Upload with hover overlay -->
        <div class="row justify-center q-mb-lg">
          <div
            class="relative q-mb-md"
            style="width: 130px; height: 130px; cursor: pointer; border-radius: 50%; overflow: hidden;"
            @click="triggerFileInput"
            @mouseenter="avatarHover = true"
            @mouseleave="avatarHover = false"
          >
            <q-avatar size="130px" class="q-pa-xs">
              <transition name="fade">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="User Avatar" key="profile.avatarUrl" style="object-fit: cover; width: 130px; height: 130px;" />
              </transition>
            </q-avatar>

            <transition name="fade">
              <div
                v-if="avatarHover"
                class="absolute-full bg-black-6 flex flex-center text-white"
                style="border-radius: 50%; backdrop-filter: brightness(0.6);"
              >
                <q-icon name="camera_alt" size="36px" />
              </div>
            </transition>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <q-form @submit.prevent="saveProfile" ref="formRef" class="q-gutter-md">

          <q-input
            filled
            v-model="profile.name"
            label="Full Name"
            :rules="[val => !!val || 'Name is required']"
            lazy-rules
          />

          <q-input
            filled
            v-model="profile.email"
            label="Email Address"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /^\S+@\S+\.\S+$/.test(val) || 'Email must be valid'
            ]"
            lazy-rules
          />

          <q-input
            filled
            v-model="profile.phone"
            label="Phone Number"
            mask="+## ### ### ####"
            hint="+XX XXX XXX XXXX"
            lazy-rules
          />

          <q-input
            filled
            v-model="profile.dob"
            label="Date of Birth"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            hint="Format: YYYY-MM-DD"
          />

          <q-input
            filled
            v-model="profile.bio"
            type="textarea"
            label="Bio / About Me"
            autogrow
            maxlength="300"
            counter
            class="q-mt-md"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-input
              filled
              v-model="profile.social.facebook"
              label="Facebook URL"
              placeholder="https://facebook.com/username"
              :rules="[urlRule]"
              class="col"
              dense
            >
              <template #append>
                <q-icon name="facebook" size="18px" class="text-blue" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="profile.social.twitter"
              label="Twitter URL"
              placeholder="https://twitter.com/username"
              :rules="[urlRule]"
              class="col"
              dense
            >
              <template #append>
                <q-icon name="twitter" size="18px" class="text-blue" />
              </template>
            </q-input>
          </div>

          <q-input
            filled
            v-model="profile.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            @click:append="showPassword = !showPassword"
            hint="Leave blank if you don't want to change password"
            class="q-mt-md"
          />

          <q-input
            filled
            v-model="profile.confirmPassword"
            label="Confirm Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            hint="Must match the new password"
            :rules="[val => val === profile.password || 'Passwords do not match']"
            lazy-rules
          />

          <q-select
            filled
            v-model="profile.theme"
            label="Theme Preference"
            :options="['Light', 'Dark', 'System']"
            class="q-mt-md"
          />

          <div class="row justify-between q-mt-lg">
            <q-btn
              label="Reset"
              color="grey-6"
              flat
              @click="resetProfile"
              :disable="loading"
            />
            <q-btn
              label="Save Changes"
              type="submit"
              color="primary"
              :loading="loading"
              :disable="loading"
              spinner-color="white"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const fileInput = ref(null)
const formRef = ref(null)

const profile = ref({
  name: '',
  email: '',
  phone: '',
  dob: '',
  bio: '',
  password: '',
  confirmPassword: '',
  avatarUrl: 'https://cdn.quasar.dev/img/avatar.png',
  theme: 'System',
  social: {
    facebook: '',
    twitter: ''
  }
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const avatarHover = ref(false)
const loading = ref(false)

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      profile.value.avatarUrl = reader.result
    }
    reader.readAsDataURL(file)
  } else {
    $q.notify({ type: 'negative', message: 'Please select a valid image file' })
  }
}

const urlRule = val => {
  if (!val) return true
  try {
    new URL(val)
    return true
  } catch {
    return 'Must be a valid URL'
  }
}

async function saveProfile() {
  loading.value = true
  try {
    const valid = await formRef.value.validate()
    if (!valid) {
      $q.notify({ type: 'negative', message: 'Please fix the errors in the form' })
      return
    }
    if (profile.value.password !== profile.value.confirmPassword) {
      $q.notify({ type: 'negative', message: 'Passwords do not match' })
      return
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    $q.notify({ type: 'positive', message: 'Profile updated successfully' })

    // Clear passwords after save
    profile.value.password = ''
    profile.value.confirmPassword = ''
  } finally {
    loading.value = false
  }
}

function resetProfile() {
  formRef.value.resetValidation()
  profile.value = {
    name: '',
    email: '',
    phone: '',
    dob: '',
    bio: '',
    password: '',
    confirmPassword: '',
    avatarUrl: 'https://cdn.quasar.dev/img/avatar.png',
    theme: 'System',
    social: {
      facebook: '',
      twitter: ''
    }
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute-full {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>