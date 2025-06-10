<template>
  <q-page padding>
    <!-- Header -->
    <q-card flat class="q-pa-md bg-primary text-white shadow-2 rounded-borders q-mb-md">
      <q-card-section>
        <div class="text-h5">Help & Support</div>
        <div class="text-subtitle2">Get answers to common questions and guidance</div>
      </q-card-section>
    </q-card>

    <!-- Search + Tabs -->
    <div class="row items-center q-gutter-sm q-mb-sm">
      <q-input
        filled
        dense
        debounce="300"
        v-model="search"
        placeholder="Search help topics..."
        class="col"
        clearable
        prefix="search"
      />
      <q-tabs
        v-model="category"
        dense
        class="bg-grey-2"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
      >
        <q-tab v-for="cat in categories" :key="cat" :name="cat" :label="cat" />
      </q-tabs>
    </div>

    <!-- FAQ List -->
    <q-card class="q-mt-md">
      <q-card-section>
        <q-expansion-item
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          :label="faq.question"
          icon="help_outline"
          expand-separator
          dense-toggle
        >
          <div class="q-pt-sm">{{ faq.answer }}</div>
        </q-expansion-item>

        <div v-if="filteredFaqs.length === 0" class="text-grey text-center q-mt-md">
          No help topics found.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const category = ref('All')

const categories = ['All', 'Reminders', 'Focus Mode', 'Trash']

const faqs = [
  {
    question: 'How to add a new reminder?',
    answer: 'Go to the Reminders page and click the Add button to create a new reminder.',
    category: 'Reminders'
  },
  {
    question: 'How to delete a reminder?',
    answer: 'Click the delete icon next to the reminder you want to remove.',
    category: 'Reminders'
  },
  {
    question: 'How to use Focus Mode?',
    answer: 'Open the Focus Mode page and click Start to begin your focus timer.',
    category: 'Focus Mode'
  },
  {
    question: 'How can I recover deleted items?',
    answer: 'Go to the Trash page, select items and click Restore.',
    category: 'Trash'
  },
  {
    question: 'How to permanently delete items?',
    answer: 'Go to Trash and click Empty Trash or Delete Forever.',
    category: 'Trash'
  }
]

const filteredFaqs = computed(() => {
  return faqs.filter(faq => {
    const matchCategory = category.value === 'All' || faq.category === category.value
    const matchSearch = faq.question.toLowerCase().includes(search.value.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(search.value.toLowerCase())
    return matchCategory && matchSearch
  })
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>